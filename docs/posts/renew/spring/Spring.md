# Spring

## IOC

### 启动流程

SpringBoot 和 Spring 启动流程类似，都会调用 `AbstractApplicationContext#refresh`。但是 SpringBoot 在运行前需要比 Spring 多做一些初始化和前置工作。

<br>

#### SpringApplication#run

> SpringBoot 程序初始化

```java
// SpringApplication#run

// Run the Spring application, creating and refreshing a new ApplicationContext.
public ConfigurableApplicationContext run(String... args) {
  long startTime = System.nanoTime();
  
  /**
   * 创建并初始化 BootstrapContext
   * 
   * BootstrapContext
   * BootstrapContext 是 SpringBoot 启动时的引导上下文，会在启动和 Environment 
   * 后续处理过程中可用，直到 ApplicationContext 被准备好。
   * 提供相应的懒加载单例 bean，这些 bean 可能需要较高的代价去创建，或者在容器启动时会被需要
   */
  DefaultBootstrapContext bootstrapContext = createBootstrapContext();
  ConfigurableApplicationContext context = null;
  
  /**
   * 为系统属性设置 java.awt.headless 值，其作用是判断当前是否运行在 headless 模式下。
   * 
   * Headless 模式是指在没有显示设备的情况下运行程序，即没有可视化界面，一般用于服务器
   * 或者一些没有 GUI 的环境下。在 headless 模式下，某些与 GUI 相关的操作将无法使用
   * 或者无法正常工作。
   * 在设置 java.awt.headless 为 true 后，Java 将会禁用一些与 GUI 相关的操作，从而保证
   * 程序在 headless 模式下的正常运行
   *
   * 在 Spring Boot 启动过程中，设置 java.awt.headless 系统属性可以确保应用程序在任何情况
   * 下都能够正常运行，特别是在没有 GUI 的服务器环境下。
   */
  configureHeadlessProperty();
  
  // 获取到所有运行监听器，启动后监听运行上下文环境和运行的 main 方法
  SpringApplicationRunListeners listeners = getRunListeners(args);
  listeners.starting(bootstrapContext, this.mainApplicationClass);
  try {
    // 获取 main 方法的运行参数
    ApplicationArguments applicationArguments = new DefaultApplicationArguments(args);
    // 准备运行环境，创建并配置运行环境，最后将运行环境信息绑定到 SpringApplication
    ConfigurableEnvironment environment = prepareEnvironment(listeners, bootstrapContext, applicationArguments);
    // 配置需要忽略的 bean
    configureIgnoreBeanInfo(environment);
    // 获取打印的 banner，默认搜索 resources 下的 banner.txt
    Banner printedBanner = printBanner(environment);
    /**
     * 创建 ApplicationContext
     * 会判断是否需要创建 WebApplicationContext
     */
    context = createApplicationContext();
    // 设置启动类
    context.setApplicationStartup(this.applicationStartup);
    /**
     * 准备上下文环境
     * 为 context 设置环境信息，配置后置处理器，应用初始化，准备 listener 等
     */
    prepareContext(bootstrapContext, context, environment, listeners, applicationArguments, printedBanner);
    /**
     * 刷新上下文环境
     * 注册容器关闭 hook，并刷新容器
     * 内部调用 AbstractApplicationContext#refresh
     */
    refreshContext(context);
    
    afterRefresh(context, applicationArguments);
    
    Duration timeTakenToStartup = Duration.ofNanos(System.nanoTime() - startTime);
    if (this.logStartupInfo) {
      new StartupInfoLogger(this.mainApplicationClass).logStarted(getApplicationLog(), timeTakenToStartup);
    }
    listeners.started(context, timeTakenToStartup);
    callRunners(context, applicationArguments);
  }
  catch (Throwable ex) {
    handleRunFailure(context, ex, listeners);
    throw new IllegalStateException(ex);
  }
  try {
    Duration timeTakenToReady = Duration.ofNanos(System.nanoTime() - startTime);
    listeners.ready(context, timeTakenToReady);
  }
  catch (Throwable ex) {
    handleRunFailure(context, ex, null);
    throw new IllegalStateException(ex);
  }
  return context;
}

// SpringApplication#refreshContext
private void refreshContext(ConfigurableApplicationContext context) {
  if (this.registerShutdownHook) {
    shutdownHook.registerApplicationContext(context);
  }
  refresh(context);
}

protected void refresh(ConfigurableApplicationContext applicationContext) {
  applicationContext.refresh();
}
```

<br>

#### refresh

> Spring 的 IOC 容器启动的主要方法

```java
// AbstractApplicationContext#refresh

/**
 * 加载或刷新配置信息
 * 如果容器启动失败，需要销毁之前创建的单例 bean。调用此方法后，要么成功创建出所有需要的单例 bean，
 * 要么销毁所有单例 bean
 */
public void refresh() throws BeansException, IllegalStateException {
  synchronized (this.startupShutdownMonitor) {
    StartupStep contextRefresh = this.applicationStartup.start("spring.context.refresh");

    // Prepare this context for refreshing.
    prepareRefresh(); // 初始化配置文件，校验配置信息，并注册早期 listener

    /**
     * 获取 BeanFactory
     * 如果 BeanFactory 已存在，销毁所有已创建的 bean，关闭 BeanFactory，再重新创建 BeanFactory
     *
     * 到这一步，配置文件中配置的 bean 信息都已经被 BeanFactory 获取到
     * 注意：仅仅是加载到 bean 的信息，并没有对 bean 进行实例化
     */
    // Tell the subclass to refresh the internal bean factory.
    ConfigurableListableBeanFactory beanFactory = obtainFreshBeanFactory();

    // 配置 BeanFactory 的上下文信息，比如 ClassLoader 和 bean 后置处理器
    // Prepare the bean factory for use in this context.
    prepareBeanFactory(beanFactory);

    try {
      // 对 BeanFactory 进行一些后续的处理操作
      // Allows post-processing of the bean factory in context subclasses.
      postProcessBeanFactory(beanFactory);

      StartupStep beanPostProcess = this.applicationStartup.start("spring.context.beans.post-process");
      
      /**
       * 初始化并调用所有已注册的 BeanFactoryPostProcessor
       *
       * Instantiate and invoke all registered BeanFactoryPostProcessor beans.
       * Must be called before singleton instantiation.
       * Invoke factory processors registered as beans in the context.
       */
      invokeBeanFactoryPostProcessors(beanFactory);

      // 注册 BeanPostProcessor
      // Register bean processors that intercept bean creation.
      registerBeanPostProcessors(beanFactory);
      beanPostProcess.end(); // 后置处理器操作结束

      // Initialize message source for this context.
      initMessageSource(); // 初始化信息源，如果不存在使用父类的信息源

      // Initialize event multicaster for this context.
      initApplicationEventMulticaster(); // 初始化 ApplicationEvent 事件多播器

      // Initialize other special beans in specific context subclasses.
      onRefresh(); // 初始化其他特殊的 bean

      // Check for listener beans and register them.
      registerListeners(); // 注册监听器

      /**
       * 实例化所有非懒加载的单例 bean
       * 所有的非懒加载单例 bean 被创建出来后使用 DefaultSingletonBeanRegistry#addSingleton
       * 将实例化完成的 bean 放入一个 ConcurrentHashMap 中，key=beanName，value=bean 实例
       */
      // Instantiate all remaining (non-lazy-init) singletons.
      finishBeanFactoryInitialization(beanFactory);

      // Last step: publish corresponding event.
      finishRefresh(); // 清理操作
    }

    catch (BeansException ex) {
      if (logger.isWarnEnabled()) {
        logger.warn("Exception encountered during context initialization - " +
            "cancelling refresh attempt: " + ex);
      }

      // Destroy already created singletons to avoid dangling resources.
      destroyBeans(); // 如果启动失败，销毁所有由当前容器创建的 bean

      // Reset 'active' flag.
      cancelRefresh(ex);

      // Propagate exception to caller.
      throw ex;
    }

    finally {
      // Reset common introspection caches in Spring's core, since we
      // might not ever need metadata for singleton beans anymore...
      resetCommonCaches();
      contextRefresh.end(); // 结束
    }
  }
}
```

<br>

### Bean 创建流程

#### finishBeanFactoryInitialization

```java
// AbstractApplicationContext#finishBeanFactoryInitialization

// 对所有非懒加载的单例 bean 进行初始化，并放入缓存
// Finish the initialization of this context's bean factory, initializing all 
// remaining singleton beans.
protected void finishBeanFactoryInitialization(ConfigurableListableBeanFactory beanFactory) {
  // Initialize conversion service for this context.
  // ...

  // Register a default embedded value resolver if no BeanFactoryPostProcessor
  // (such as a PropertySourcesPlaceholderConfigurer bean) registered any before:
  // at this point, primarily for resolution in annotation attribute values.
  // ...

  // Initialize LoadTimeWeaverAware beans early to allow for registering their transformers early.
  // ...

  // Stop using the temporary ClassLoader for type matching.
  beanFactory.setTempClassLoader(null);

  // Allow for caching all bean definition metadata, not expecting further changes.
  beanFactory.freezeConfiguration();

  // Instantiate all remaining (non-lazy-init) singletons.
  beanFactory.preInstantiateSingletons();
}
```

<br>

#### preInstantiateSingletons

```java
// DefaultListableBeanFactory#preInstantiateSingletons
public void preInstantiateSingletons() throws BeansException {

  // Iterate over a copy to allow for init methods which in turn register new bean definitions.
  // While this may not be part of the regular factory bootstrap, it does otherwise work fine.
  List<String> beanNames = new ArrayList<>(this.beanDefinitionNames); // 遍历 beanNames

  // 初始化所有非懒加载单例 bean
  // Trigger initialization of all non-lazy singleton beans...
  for (String beanName : beanNames) {
    // A root bean definition is essentially the 'unified' bean definition view at runtime.
    RootBeanDefinition bd = getMergedLocalBeanDefinition(beanName);
    if (!bd.isAbstract() && bd.isSingleton() && !bd.isLazyInit()) {
      if (isFactoryBean(beanName)) { // 检查是否是工厂 bean
        Object bean = getBean(FACTORY_BEAN_PREFIX + beanName);
        if (bean instanceof FactoryBean) {
          FactoryBean<?> factory = (FactoryBean<?>) bean;
          boolean isEagerInit;
          if (System.getSecurityManager() != null && factory instanceof SmartFactoryBean) {
            isEagerInit = AccessController.doPrivileged(
                (PrivilegedAction<Boolean>) ((SmartFactoryBean<?>) factory)::isEagerInit,
                getAccessControlContext());
          }
          else {
            isEagerInit = (factory instanceof SmartFactoryBean &&
                ((SmartFactoryBean<?>) factory).isEagerInit());
          }
          if (isEagerInit) {
            getBean(beanName);
          }
        }
      }
      else {
        getBean(beanName); // 创建 bean
      }
    }
  }
}
```

<br>

#### doGetBean

```java
// AbstractBeanFactory#doGetBean

// Return an instance, which may be shared or independent, of the specified bean.
protected <T> T doGetBean(
    String name, @Nullable Class<T> requiredType, @Nullable Object[] args, boolean typeCheckOnly)
    throws BeansException {

  String beanName = transformedBeanName(name);
  Object beanInstance;

  // Eagerly check singleton cache for manually registered singletons.
  // 检查单例 bean 缓存，看是否已经注册过当前需要创建的 bean
  // ...

  else {
    // Fail if we're already creating this bean instance:
    // We're assumably within a circular reference.
    // 检查是否是循环引用
    // ...

    // Check if bean definition exists in this factory.
    // ...

    // 将 Bean 标记为已创建
    if (!typeCheckOnly) {
      markBeanAsCreated(beanName);
    }

    StartupStep beanCreation = this.applicationStartup.start("spring.beans.instantiate")
        .tag("beanName", name);
    
    try {
      if (requiredType != null) {
        beanCreation.tag("beanType", requiredType::toString);
      }
      RootBeanDefinition mbd = getMergedLocalBeanDefinition(beanName);
      checkMergedBeanDefinition(mbd, beanName, args);

      // Guarantee initialization of beans that the current bean depends on.
      // 检查当前创建的 bean 是否依赖于其他 bean
      // ...

      // Create bean instance.
      if (mbd.isSingleton()) { // 创建单例 bean
        // getSingleton 内部使用同步代码块调用 addSingleton 方法，
        // 将创建好的单例 bean 放入缓存中
        sharedInstance = getSingleton(beanName, () -> { 
          try {
            return createBean(beanName, mbd, args); 
          }
          catch (BeansException ex) {
            // Explicitly remove instance from singleton cache: It might have been put there
            // eagerly by the creation process, to allow for circular reference resolution.
            // Also remove any beans that received a temporary reference to the bean.
            destroySingleton(beanName);
            throw ex;
          }
        });
        beanInstance = getObjectForBeanInstance(sharedInstance, name, beanName, mbd);
      }

      else if (mbd.isPrototype()) { // 创建原型 bean
        // It's a prototype -> create a new instance.
        Object prototypeInstance = null;
        try {
          beforePrototypeCreation(beanName);
          prototypeInstance = createBean(beanName, mbd, args);
        }
        finally {
          afterPrototypeCreation(beanName);
        }
        beanInstance = getObjectForBeanInstance(prototypeInstance, name, beanName, mbd);
      }

      else { // 创建其他类型的 bean（request or session）
        String scopeName = mbd.getScope();
        if (!StringUtils.hasLength(scopeName)) {
          throw new IllegalStateException("No scope name defined for bean '" + beanName + "'");
        }
        Scope scope = this.scopes.get(scopeName);
        if (scope == null) {
          throw new IllegalStateException("No Scope registered for scope name '" + scopeName + "'");
        }
        try {
          Object scopedInstance = scope.get(beanName, () -> {
            beforePrototypeCreation(beanName);
            try {
              return createBean(beanName, mbd, args);
            }
            finally {
              afterPrototypeCreation(beanName);
            }
          });
          beanInstance = getObjectForBeanInstance(scopedInstance, name, beanName, mbd);
        }
        catch (IllegalStateException ex) {
          throw new ScopeNotActiveException(beanName, scopeName, ex);
        }
      }
    }
    catch (BeansException ex) {
      beanCreation.tag("exception", ex.getClass().toString());
      beanCreation.tag("message", String.valueOf(ex.getMessage()));
      cleanupAfterBeanCreationFailure(beanName);
      throw ex;
    }
    finally {
      beanCreation.end(); // bean 创建结束
    }
  }

  return adaptBeanInstance(name, beanInstance, requiredType);
}
```

<br>

#### createBean

```java
// AbstractAutowireCapableBeanFactory#createBean

// 创建并填充 bean 属性值，并调用 bean 后置处理器
// Central method of this class: creates a bean instance, populates the bean 
// instance, applies post-processors, etc.
protected Object createBean(String beanName, RootBeanDefinition mbd, @Nullable Object[] args)
    throws BeanCreationException {

  RootBeanDefinition mbdToUse = mbd;

  // Make sure bean class is actually resolved at this point, and
  // clone the bean definition in case of a dynamically resolved Class
  // which cannot be stored in the shared merged bean definition.
  Class<?> resolvedClass = resolveBeanClass(mbd, beanName);
  if (resolvedClass != null && !mbd.hasBeanClass() && mbd.getBeanClassName() != null) {
    mbdToUse = new RootBeanDefinition(mbd);
    mbdToUse.setBeanClass(resolvedClass);
  }

  // Prepare method overrides.
  try {
    mbdToUse.prepareMethodOverrides();
  }
  catch (BeanDefinitionValidationException ex) {
    throw new BeanDefinitionStoreException(mbdToUse.getResourceDescription(),
        beanName, "Validation of method overrides failed", ex);
  }

  try {
    // Give BeanPostProcessors a chance to return a proxy instead of the target bean instance.
    Object bean = resolveBeforeInstantiation(beanName, mbdToUse);
    if (bean != null) {
      return bean;
    }
  }
  catch (Throwable ex) {
    throw new BeanCreationException(mbdToUse.getResourceDescription(), beanName,
        "BeanPostProcessor before instantiation of bean failed", ex);
  }

  try {
    Object beanInstance = doCreateBean(beanName, mbdToUse, args);
    if (logger.isTraceEnabled()) {
      logger.trace("Finished creating instance of bean '" + beanName + "'");
    }
    return beanInstance;
  }
  catch (BeanCreationException | ImplicitlyAppearedSingletonException ex) {
    // A previously detected exception with proper bean creation context already,
    // or illegal singleton state to be communicated up to DefaultSingletonBeanRegistry.
    throw ex;
  }
  catch (Throwable ex) {
    throw new BeanCreationException(
        mbdToUse.getResourceDescription(), beanName, "Unexpected exception during bean creation", ex);
  }
}
```

<br>

#### doCreateBean

```java
// AbstractAutowireCapableBeanFactory#doCreateBean

// Actually create the specified bean. Pre-creation processing has already happened
// at this point, e.g. checking postProcessBeforeInstantiation callbacks.
// Differentiates between default bean instantiation, use of a factory method, 
// and autowiring a constructor.
protected Object doCreateBean(String beanName, RootBeanDefinition mbd, @Nullable Object[] args)
    throws BeanCreationException {

  // Instantiate the bean.
  BeanWrapper instanceWrapper = null;
  if (mbd.isSingleton()) {
    instanceWrapper = this.factoryBeanInstanceCache.remove(beanName);
  }
  if (instanceWrapper == null) {
    instanceWrapper = createBeanInstance(beanName, mbd, args);
  }
  Object bean = instanceWrapper.getWrappedInstance();
  Class<?> beanType = instanceWrapper.getWrappedClass();
  if (beanType != NullBean.class) {
    mbd.resolvedTargetType = beanType;
  }

  // Allow post-processors to modify the merged bean definition.
  synchronized (mbd.postProcessingLock) {
    if (!mbd.postProcessed) {
      try {
        applyMergedBeanDefinitionPostProcessors(mbd, beanType, beanName);
      }
      catch (Throwable ex) {
        throw new BeanCreationException(mbd.getResourceDescription(), beanName,
            "Post-processing of merged bean definition failed", ex);
      }
      mbd.markAsPostProcessed();
    }
  }

  // Eagerly cache singletons to be able to resolve circular references
  // even when triggered by lifecycle interfaces like BeanFactoryAware.
  boolean earlySingletonExposure = (mbd.isSingleton() && this.allowCircularReferences &&
      isSingletonCurrentlyInCreation(beanName));
  if (earlySingletonExposure) {
    if (logger.isTraceEnabled()) {
      logger.trace("Eagerly caching bean '" + beanName +
          "' to allow for resolving potential circular references");
    }
    addSingletonFactory(beanName, () -> getEarlyBeanReference(beanName, mbd, bean));
  }

  // Initialize the bean instance.
  Object exposedObject = bean;
  try {
    populateBean(beanName, mbd, instanceWrapper);
    exposedObject = initializeBean(beanName, exposedObject, mbd);
  }
  catch (Throwable ex) {
    if (ex instanceof BeanCreationException bce && beanName.equals(bce.getBeanName())) {
      throw bce;
    }
    else {
      throw new BeanCreationException(mbd.getResourceDescription(), beanName, ex.getMessage(), ex);
    }
  }

  if (earlySingletonExposure) {
    Object earlySingletonReference = getSingleton(beanName, false);
    if (earlySingletonReference != null) {
      if (exposedObject == bean) {
        exposedObject = earlySingletonReference;
      }
      else if (!this.allowRawInjectionDespiteWrapping && hasDependentBean(beanName)) {
        String[] dependentBeans = getDependentBeans(beanName);
        Set<String> actualDependentBeans = new LinkedHashSet<>(dependentBeans.length);
        for (String dependentBean : dependentBeans) {
          if (!removeSingletonIfCreatedForTypeCheckOnly(dependentBean)) {
            actualDependentBeans.add(dependentBean);
          }
        }
        if (!actualDependentBeans.isEmpty()) {
          throw new BeanCurrentlyInCreationException(beanName,
              "Bean with name '" + beanName + "' has been injected into other beans [" +
              StringUtils.collectionToCommaDelimitedString(actualDependentBeans) +
              "] in its raw version as part of a circular reference, but has eventually been " +
              "wrapped. This means that said other beans do not use the final version of the " +
              "bean. This is often the result of over-eager type matching - consider using " +
              "'getBeanNamesForType' with the 'allowEagerInit' flag turned off, for example.");
        }
      }
    }
  }

  // Register bean as disposable.
  try {
    registerDisposableBeanIfNecessary(beanName, bean, mbd);
  }
  catch (BeanDefinitionValidationException ex) {
    throw new BeanCreationException(
        mbd.getResourceDescription(), beanName, "Invalid destruction signature", ex);
  }

  return exposedObject;
}
```

<br>

#### createBeanInstance

```java
// AbstractAutowireCapableBeanFactory#createBeanInstance

// Create a new instance for the specified bean, using an appropriate instantiation
// strategy: factory method, constructor autowiring, or simple instantiation.
protected BeanWrapper createBeanInstance(String beanName, RootBeanDefinition mbd, @Nullable Object[] args) {
  // Make sure bean class is actually resolved at this point.
  Class<?> beanClass = resolveBeanClass(mbd, beanName);

  // 检查是否是 public 修饰的 bean，非 public 无法创建

  Supplier<?> instanceSupplier = mbd.getInstanceSupplier();
  if (instanceSupplier != null) {
    return obtainFromSupplier(instanceSupplier, beanName);
  }

  if (mbd.getFactoryMethodName() != null) {
    return instantiateUsingFactoryMethod(beanName, mbd, args);
  }

  // 非单例 bean 创建
  // Shortcut when re-creating the same bean...
  boolean resolved = false;
  boolean autowireNecessary = false;
  if (args == null) {
    synchronized (mbd.constructorArgumentLock) {
      if (mbd.resolvedConstructorOrFactoryMethod != null) {
        resolved = true;
        autowireNecessary = mbd.constructorArgumentsResolved;
      }
    }
  }
  if (resolved) {
    if (autowireNecessary) { // 检查是否需要进行构造器注入
      return autowireConstructor(beanName, mbd, null, null);
    }
    else {
      return instantiateBean(beanName, mbd); //无需进行构造器注入
    }
  }

  // Candidate constructors for autowiring?
  Constructor<?>[] ctors = determineConstructorsFromBeanPostProcessors(beanClass, beanName);
  if (ctors != null || mbd.getResolvedAutowireMode() == AUTOWIRE_CONSTRUCTOR ||
      mbd.hasConstructorArgumentValues() || !ObjectUtils.isEmpty(args)) {
    return autowireConstructor(beanName, mbd, ctors, args);
  }

  // Preferred constructors for default construction?
  ctors = mbd.getPreferredConstructors();
  if (ctors != null) {
    return autowireConstructor(beanName, mbd, ctors, null);
  }

  // No special handling: simply use no-arg constructor.
  return instantiateBean(beanName, mbd); // 使用无参构造器创建 bean
}
```

<br>

#### instantiateBean

```java
// AbstractAutowireCapableBeanFactory#initializeBean

// Initialize the given bean instance, applying factory callbacks as well as init methods 
// and bean post processors. Called from createBean for traditionally defined beans, and 
// from initializeBean for existing bean instances.
protected Object initializeBean(String beanName, Object bean, @Nullable RootBeanDefinition mbd) {
  
  invokeAwareMethods(beanName, bean);

  Object wrappedBean = bean;
  if (mbd == null || !mbd.isSynthetic()) {
    // 执行 BeanPostProcessorsBeforeInitialization
    wrappedBean = applyBeanPostProcessorsBeforeInitialization(wrappedBean, beanName);
  }

  try {
    // 执行 bean 创建
    invokeInitMethods(beanName, wrappedBean, mbd);
  }
  catch (Throwable ex) {
    throw new BeanCreationException(
        (mbd != null ? mbd.getResourceDescription() : null), beanName, ex.getMessage(), ex);
  }
  if (mbd == null || !mbd.isSynthetic()) {
    // 执行 BeanPostProcessorsAfterInitialization
    wrappedBean = applyBeanPostProcessorsAfterInitialization(wrappedBean, beanName);
  }

  return wrappedBean;
}
```



<br>

### Bean 获取流程

#### getBean

```java
// DefaultListableBeanFactory#getBean
public <T> T getBean(Class<T> requiredType, @Nullable Object... args) throws BeansException {
  Assert.notNull(requiredType, "Required type must not be null");
  Object resolved = resolveBean(ResolvableType.forRawClass(requiredType), args, false);
  if (resolved == null) {
    throw new NoSuchBeanDefinitionException(requiredType);
  }
  return (T) resolved;
}
```

<br>

#### resolveBean

```java
// DefaultListableBeanFactory#resolveBean

private <T> T resolveBean(ResolvableType requiredType, @Nullable Object[] args, boolean nonUniqueAsNull) {
  NamedBeanHolder<T> namedBean = resolveNamedBean(requiredType, args, nonUniqueAsNull);
  if (namedBean != null) {
    return namedBean.getBeanInstance();
  }
  BeanFactory parent = getParentBeanFactory();
  if (parent instanceof DefaultListableBeanFactory dlfb) {
    return dlfb.resolveBean(requiredType, args, nonUniqueAsNull);
  }
  else if (parent != null) {
    ObjectProvider<T> parentProvider = parent.getBeanProvider(requiredType);
    if (args != null) {
      return parentProvider.getObject(args);
    }
    else {
      return (nonUniqueAsNull ? parentProvider.getIfUnique() : parentProvider.getIfAvailable());
    }
  }
  return null;
}
```

<br>

#### NamedBeanHolder

```java
// DefaultListableBeanFactory#resolveNamedBean

private <T> NamedBeanHolder<T> resolveNamedBean(
    ResolvableType requiredType, @Nullable Object[] args, boolean nonUniqueAsNull) throws BeansException {

  Assert.notNull(requiredType, "Required type must not be null");
  // 根据 requiredType 获取到同一类型的所有 beanName
  String[] candidateNames = getBeanNamesForType(requiredType);

  if (candidateNames.length > 1) { // 如果存在多个 requiredType 同一类型的 bean
    List<String> autowireCandidates = new ArrayList<>(candidateNames.length);
    for (String beanName : candidateNames) {
      if (!containsBeanDefinition(beanName) || getBeanDefinition(beanName).isAutowireCandidate()) {
        autowireCandidates.add(beanName);
      }
    }
    if (!autowireCandidates.isEmpty()) {
      candidateNames = StringUtils.toStringArray(autowireCandidates);
    }
  }

  if (candidateNames.length == 1) { // 只存在一个 requiredType 类型的 bean
    return resolveNamedBean(candidateNames[0], requiredType, args);
  }
  else if (candidateNames.length > 1) {
    Map<String, Object> candidates = CollectionUtils.newLinkedHashMap(candidateNames.length);
    for (String beanName : candidateNames) {
      if (containsSingleton(beanName) && args == null) {
        Object beanInstance = getBean(beanName);
        candidates.put(beanName, (beanInstance instanceof NullBean ? null : beanInstance));
      }
      else {
        candidates.put(beanName, getType(beanName));
      }
    }
    String candidateName = determinePrimaryCandidate(candidates, requiredType.toClass());
    if (candidateName == null) {
      candidateName = determineHighestPriorityCandidate(candidates, requiredType.toClass());
    }
    if (candidateName != null) {
      Object beanInstance = candidates.get(candidateName);
      if (beanInstance == null) {
        return null;
      }
      if (beanInstance instanceof Class) {
        return resolveNamedBean(candidateName, requiredType, args);
      }
      return new NamedBeanHolder<>(candidateName, (T) beanInstance);
    }
    if (!nonUniqueAsNull) {
      throw new NoUniqueBeanDefinitionException(requiredType, candidates.keySet());
    }
  }

  return null;
}
```

<br>

#### resolveNamedBean

```java
private <T> NamedBeanHolder<T> resolveNamedBean(
    String beanName, ResolvableType requiredType, @Nullable Object[] args) throws BeansException {

  Object bean = getBean(beanName, null, args); // 调用 getSingleton 从缓存中获取 bean
  if (bean instanceof NullBean) {
    return null;
  }
  return new NamedBeanHolder<>(beanName, adaptBeanInstance(beanName, bean, requiredType.toClass()));
}
```

<br>

#### getSingleton

```java
protected Object getSingleton(String beanName, boolean allowEarlyReference) {
  
  // singletonObjects 是一个 ConcurrentHashMap
  // Quick check for existing instance without full singleton lock
  Object singletonObject = this.singletonObjects.get(beanName);
  
  // 如果是并发创建 bean
  if (singletonObject == null && isSingletonCurrentlyInCreation(beanName)) {
    singletonObject = this.earlySingletonObjects.get(beanName);
    if (singletonObject == null && allowEarlyReference) {
      synchronized (this.singletonObjects) {
        // Consistent creation of early reference within full singleton lock
        singletonObject = this.singletonObjects.get(beanName);
        if (singletonObject == null) {
          singletonObject = this.earlySingletonObjects.get(beanName);
          if (singletonObject == null) {
            ObjectFactory<?> singletonFactory = this.singletonFactories.get(beanName);
            if (singletonFactory != null) {
              singletonObject = singletonFactory.getObject();
              this.earlySingletonObjects.put(beanName, singletonObject);
              this.singletonFactories.remove(beanName);
            }
          }
        }
      }
    }
  }
  return singletonObject;
}
```



<br>

### Bean 状态

> Bean 有无状态和有状态之分：
>
> * 有状态是指在 bean 的生命周期内维护了某些状态变量，并且其他地方获取该 bean 时，仍能够访问到之前保存的状态变量数据；
> * 无状态是指在 bean 的生命周期中的行为不受先前操作和状态的影响，每次操作都是独立的。
>
> <br>
>
> Spring 的 IOC 容器中存在多种不同生命周期的 bean，singleton、prototype、request、session。
>
> 单例 bean 能被所有能获取到 IOC 容器的地方访问到，bean 本身是共享的。如果单例 bean 是无状态的，无任何成员变量，不保存任何状态，则说明是线程安全的，比如 dao 层的类；如果单例 bean 是有状态的，在并发环境下就需要注意线程安全问题。

<br>

## 事务管理

### 事务接口及抽象类

```java
// Spring 事务的顶层父类，用来管理 Spring 事务
public interface TransactionManager {}

/**
 * PlatformTransactionManager 是 Spring 事务框架中最基础/重要的接口
 * The TransactionException that can be thrown by any of the PlatformTransactionManager interface’s methods is unchecked
 */
public interface PlatformTransactionManager extends TransactionManager {
    /**
     * 此方法根据参数 TransactionDefinition 返回一个 TransactionStatus 对象
     * 返回的 TransactionStatus 可能是一个新事务或者已存在的事务（如果当前调用栈中存在事务）
     * 参数 TransactionDefinition 描述传播行为、隔离级别、超时等
     * 此方法会根据参数对事务传播行为的定义，返回一个当前处于活跃状态的事务（如果存在），或创建一个新的事务
     * 参数对事务隔离级别或者超时时间的设置，会忽略已存在的事务，只作用于新建的事务
     * 并非所有事务定义设置都会受到每个事务管理器的支持，在遇到不受支持的设置时事务管理器会抛出异常
     */
    TransactionStatus getTransaction(TransactionDefinition definition) throws TransactionException;

    void commit(TransactionStatus status) throws TransactionException;

    void rollback(TransactionStatus status) throws TransactionException;
}

/**
 * Based on the propagation behavior definitions analogous to EJB CMT attributes.
 * Note that isolation level and timeout settings will not get applied unless an actual new transaction gets started.
 */
public interface TransactionDefinition {
  
    // Spring 事务的隔离级别与 JDBC 定义的隔离级别对应
    int ISOLATION_DEFAULT = -1;
  
  	/**
  	 * 脏读：读取到另一个事务修改但未提交的数据
  	 * 不可重复度：当事务 A 首先读取数据，事务 B 也读取同一个数据，并将数据修改，而后事务 A 再次读取就会得到和第一次读取不一样的结果
  	 * 幻读：一个事务读取所有满足 WHERE 条件的行，第二个事务插入一条满足 WHERE 条件的记录，第一个事务使用相同条件重新读取，在第二次读取中读取出额外的 "幻影 "记录
  	 */
  
  	// 读未提交
  	// 可读取到另一个事务修改但未提交的数据
  	// 存在脏读/不可重复度/幻读
  	int ISOLATION_READ_UNCOMMITTED = 1;  // same as java.sql.Connection.TRANSACTION_READ_UNCOMMITTED;
  
  	// 读已提交
  	// 解决脏读，存在不可重复度/幻读
  	int ISOLATION_READ_COMMITTED = 2;  // same as java.sql.Connection.TRANSACTION_READ_COMMITTED;
  
  	// 可重复度
  	// 解决脏读/不可重复度，存在幻读
		int ISOLATION_REPEATABLE_READ = 4;  // same as java.sql.Connection.TRANSACTION_REPEATABLE_READ;
  
  	// 可序列化/串行化，事务串行化执行，一次只允许一个事务操作
  	// 解决脏读/不可重复度/幻读
		int ISOLATION_SERIALIZABLE = 8;  // same as java.sql.Connection.TRANSACTION_SERIALIZABLE;


  	// 以下为 Spring 事务管理支持的传播行为，一共 7 种
  	/**
  	 * Support a current transaction. Create a new one if none exists. This is typically the default setting of a transaction definition and typically defines a transaction synchronization scope.
  	 * 如果当前存在事务，则加入；如果事务不存在，则新建
  	 * 这通常是事务的默认隔离级别，通常定义事务同步范围
  	 */
    int PROPAGATION_REQUIRED = 0;
  	
  	/**
  	 * Support a current transaction; execute non-transactionally if none exists.
  	 * 如果当前存在事务，则加入；如果事务不存在，则以无事务的方式运行
  	 */
  	int PROPAGATION_SUPPORTS = 1;
  
  	/**
  	 * Support a current transaction; throw an exception if no current transaction exists.
  	 * 如果当前存在事务，则加入；如果不存在则抛出异常
  	 */
  	int PROPAGATION_MANDATORY = 2;
  	/**
  	 * Create a new transaction, suspending the current transaction if one exists.
  	 * 如果存在事务，则暂停当前事务，创建新事务
  	 */
		int PROPAGATION_REQUIRES_NEW = 3;
  	/**
  	 * Do not support a current transaction; rather always execute non-transactionally.
  	 * 总是以无事务的方式运行
  	 */
		int PROPAGATION_NOT_SUPPORTED = 4;
  	/**
  	 * Do not support a current transaction; throw an exception if a current transaction exists.
  	 * 如果当前存在事务则抛出异常
  	 */
  	int PROPAGATION_NEVER = 5;
  	/**
  	 * Execute within a nested transaction if a current transaction exists, behaving like PROPAGATION_REQUIRED otherwise.
  	 * 如果当前存在事务，则在嵌套事务中执行，否则表现为 PROPAGATION_REQUIRED
  	 */
		int PROPAGATION_NESTED = 6;
  
  	/**
  	 * 是否将事务优化为只读事务，只读标志适用于任何事务隔离级别
  	 */
    default boolean isReadOnly() {
      return false;
    }
}

/**
 * PlatformTransactionManager 的抽象实现类，它预先实现了定义的传播行为，并负责处理事务的同步。
 * 如果需要自定义事务管理框架，继承 AbstractPlatformTransactionManager 即可。子类只需要关心事务的开始，暂停，恢复和提交。
 */
public abstract class AbstractPlatformTransactionManager implements PlatformTransactionManager, Serializable {}
```



### 声明式事务

#### 开启声明式事务

Spring 的声明式事务支持需手动开启，注解驱动使用 `@EnableTransactionManagement` 标注在 Spring 配置类上，XML 开发则在配置文件加上 `<tx:annotation-driven/>` 。



> However `@EnableTransactionManagement` is more flexible; it will fall back to a by-type lookup for any `TransactionManager` bean in the container. Thus the name can be "txManager", "transactionManager", or "tm": it simply does not matter.

使用 `@EnableTransactionManagement` 相对来说更加灵活，因为它不仅可以根据名称还能根据类型将 `TransactionManager` 加载到 IOC 容器中。



> `@EnableTransactionManagement` and `<tx:annotation-driven/>` look for `@Transactional` only on beans in the same application context in which they are defined. This means that, if you put annotation-driven configuration in a `WebApplicationContext` for a `DispatcherServlet`, it checks for `@Transactional` beans only in your controllers and not in your services. 

`@EnableTransactionManagement` 和 `<tx:annotation-driven/>` 只会扫描和它们自己相同的应用上下文内的 `@Transactional` 注解，也就是说，如果在  `DispatcherServlet` 的 `WebApplicationContext` 中标注 `@EnableTransactionManagement`，它只会扫描和 Controller 同级别下的 `@Transactional`。



#### @Transactional

> When you use transactional proxies with Spring’s standard configuration, you should apply the `@Transactional` annotation only to methods with `public` visibility. If you do annotate `protected`, `private`, or package-visible methods with the `@Transactional` annotation, no error is raised, but the annotated method does not exhibit the configured transactional settings.

`@Transactional` 注解可以标注在类或者 `public` 方法上，如果标注在 `protected/private` 方法或者近包内可见的方法上不会报错，但是在这些地方 Spring 事务不会生效。



> When using `@EnableTransactionManagement` in a `@Configuration` class, `protected` or package-visible methods can also be made transactional for class-based proxies by registering a custom `transactionAttributeSource` bean.

如果在 Spring 配置类上标注 `@EnableTransactionManagement`，可以通过注入自定义的 `TransactionAttributeSource` 来让事务可以在类中的非 `public` 方法中生效。

```java
/**
 * enable support for protected and package-private @Transactional methods in
 * class-based proxies.
 */
@Bean
TransactionAttributeSource transactionAttributeSource() {
    return new AnnotationTransactionAttributeSource(false);
}
```



**类和方法的优先级**

`@Transactional` 注解可以同时标注在类和方法上，但是标注在方法上的优先级会比标注在类上的优先级高。

```java
@Transactional(readOnly = true)
public class DefaultFooService implements FooService {

    public Foo getFoo(String fooName) {}

    // 标注在方法上的优先级大于类上
    @Transactional(readOnly = false, propagation = Propagation.REQUIRES_NEW)
    public void updateFoo(Foo foo) {}
}
```



**属性设置**

* `propagation` default `Propagation.REQUIRED`
* `isolation` default `Isolation.DEFAULT`
* `timeout` default `TransactionDefinition.TIMEOUT_DEFAULT = -1`
* `readOnly` 是否是只读事务 default `false`
* `rollbackFor ` Any `RuntimeException` or `Error` triggers rollback, and any checked `Exception` does not.
* `noRollbackFor`



### 编程式事务

> 因为开发中用的大多都是声明式事务，编程式事务做了解即可



#### TransactionTemplate

类似 JdbcTemplate，由 Spring 提供的操作事务的模版方法类。

```java
public class SimpleService implements Service {
    // single TransactionTemplate shared amongst all methods in this instance
    private final TransactionTemplate transactionTemplate;

    // use constructor-injection to supply the PlatformTransactionManager
    public SimpleService(PlatformTransactionManager transactionManager) {
        this.transactionTemplate = new TransactionTemplate(transactionManager);
    }

  	// with result
    public Object someServiceMethod() {
        return transactionTemplate.execute(new TransactionCallback() {
            // the code in this method runs in a transactional context
            public Object doInTransaction(TransactionStatus status) {
                updateOperation1();
                return resultOfUpdateOperation2();
            }
        });
    }

  	// without result
    public Object methodWithoutResult() {
        transactionTemplate.execute(new TransactionCallbackWithoutResult() {
            protected void doInTransactionWithoutResult(TransactionStatus status) {
                updateOperation1();
                updateOperation2();
            }
        });
      }
  
    	// with rollback
    public Object methodWithoutRollback() {
        transactionTemplate.execute(new TransactionCallbackWithoutResult() {
            protected void doInTransactionWithoutResult(TransactionStatus status) {
                try {
                    updateOperation1();
                    updateOperation2();
                } catch (SomeBusinessException ex) {
                		status.setRollbackOnly();
                }
            }
        });
      }
}
```



#### TransactionManager

```java
DefaultTransactionDefinition def = new DefaultTransactionDefinition();
// 定义事务属性，如事务名，传播行为，隔离级别等
def.setName("SomeTxName");
def.setPropagationBehavior(TransactionDefinition.PROPAGATION_REQUIRED);

TransactionManager txManager = new JdbcTransactionManager();
TransactionStatus status = txManager.getTransaction(def);
try {
    // put your business logic here
} catch (MyException ex) {
    txManager.rollback(status);
    throw ex;
}
txManager.commit(status);
```



**声明式事务和编程式事务如何选择**

* 如果只是在代码中进行小规模的事务操作，选择编程式，比如 `TransactionTemplate`；
* 如果存在大量事务操作，优先选择声明式事务，操作简单，并且还把事务逻辑和业务逻辑分离开，利于维护；
* 如果使用的是 Spring 框架，推荐使用声明式事务。



<br>

### 回滚规则

> In its default configuration, the Spring Framework’s transaction infrastructure code marks a transaction for rollback only in the case of runtime, unchecked exceptions. That is, when the thrown exception is an instance or subclass of `RuntimeException`. (`Error` instances also, by default, result in a rollback). Checked exceptions that are thrown from a transactional method do not result in rollback in the default configuration.

Spring 事务只会在遇到运行时异常和未受检查异常时会滚，也就是说只有在遇到 `RuntimeException` 及其之类或者 `Error` 及其之类的时候才会回滚。事务遇到受检查异常时，不会回滚，而是将其捕获并抛出。

但仍然可以通过指定回滚规则，精确配置哪些异常类型会将事务标记为回滚，包括已检查的异常。



<br>

### 事务失效

1、注解 `@Transactional` 修饰的类非 Spring 容器对象；

2、用 `@Transactional` 修饰方法，且该方法被类内部方法调用；

3、注解 `@Transactional` 修饰的方法非 `public` 修饰；

4、代码中出现的异常被 catch 代码块捕获，而不是被 Spring 事务框架捕获;

5、Spring 事务 `rollback` 策略默认是 `RuntimeException` 及其子类和 `Error` 及其之类，其他情况如果未提前定义则事务失效；

6、数据库不支持事务。



<br>

## 参考

[spring#transaction](https://docs.spring.io/spring-framework/docs/current/reference/html/data-access.html#transaction)

