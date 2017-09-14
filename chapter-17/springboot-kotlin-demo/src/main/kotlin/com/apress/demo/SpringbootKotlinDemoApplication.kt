package com.apress.demo

import org.springframework.boot.SpringApplication
import org.springframework.boot.autoconfigure.SpringBootApplication

@SpringBootApplication
class SpringbootKotlinDemoApplication

fun main(args: Array<String>) {
    SpringApplication.run(SpringbootKotlinDemoApplication::class.java, *args)
}
