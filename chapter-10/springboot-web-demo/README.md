# Beginning SpringBoot 2


### Chapter 10 : Web Applications with SpringBoot

**springboot-web-demo**: This module is a basic SpringBoot web application.

#### How to run?

To use embedded tomcat servlet container:

springboot-web-demo> mvn spring-boot:run

To use embedded jetty servlet container:

springboot-web-demo> mvn spring-boot:run -P jetty

To use embedded undertow servlet container:

springboot-web-demo> mvn spring-boot:run  -P undertow


Go to http://localhost:8080/

JavaMelody Monitoring Dashboard: http://localhost:8080/monitoring 