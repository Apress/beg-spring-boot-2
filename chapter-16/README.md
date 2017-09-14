# Beginning SpringBoot 2


### Chapter 16 : Creating Custom SpringBoot Starter

**twitter4j-spring-boot-autoconfigure** : Module which contains Twitter4J AutoConfiguration bean definitions

**twitter4j-spring-boot-starter**: Module which pulls in *twitter4j-spring-boot-autoconfigure* and *twitter4j-core* dependencies

**twitter4j-spring-boot-sample**: Sample SpringBoot application which uses twitter4j-spring-boot-starter


#### How to run?

Configure Twitter OAuth parameters in **twitter4j-spring-boot-sample/src/main/resources/application.properties**

```properties
twitter4j.oauth.consumer-key=
twitter4j.oauth.consumer-secret=
twitter4j.oauth.access-token=
twitter4j.oauth.access-token-secret=
```

chapter-16> mvn clean install

chapter-16> cd twitter4j-spring-boot-sample

twitter4j-spring-boot-sample> mvn clean package spring-boot:run

You should see the latest tweets of your Twitter timeline in the console.

