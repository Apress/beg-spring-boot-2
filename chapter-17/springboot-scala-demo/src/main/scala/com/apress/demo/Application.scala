package com.apress.demo

import org.springframework.boot.SpringApplication
import org.springframework.boot.autoconfigure.SpringBootApplication

@SpringBootApplication
class Application {

}

object Application {
    def main(args: Array[String]) : Unit = {
        SpringApplication.run(classOf[Application], args:_*)
    }
}

