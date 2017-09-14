# Beginning SpringBoot 2


### Chapter 10 : Web Applications with SpringBoot

**springboot-war-demo**: This module is a basic SpringBoot web application using WAR type packaging and using JSPs as view layer.

#### How to run?

springboot-war-demo> mvn clean package

Now you can deploy the generated WAR file in target directory in external tomcat server.
You can also run war using java -jar target/springboot-war-demo-1.0-SNAPSHOT.jar

You can also run using spring-boot:run maven goal.

springboot-war-demo> mvn spring-boot:run

Go to http://localhost:8080/