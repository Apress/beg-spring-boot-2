package com.apress.demo;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * @author Siva
 *
 */

@SpringBootApplication
public class SpringbootMongodbDemoApplication implements CommandLineRunner
{
	@Autowired
	private UserRepository userRepository;
	
	public static void main(String[] args)
	{
		SpringApplication.run(SpringbootMongodbDemoApplication.class, args);
	}

	@Override
	public void run(String... args) throws Exception {
        userRepository.save(new User("1", "Robert","robert@gmail.com"));
        userRepository.save(new User("2", "Dan","dan@gmail.com"));        
	}

}
