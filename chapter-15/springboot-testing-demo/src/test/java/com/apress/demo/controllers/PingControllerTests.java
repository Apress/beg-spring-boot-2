/**
 * 
 */
package com.apress.demo.controllers;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.context.SpringBootTest.WebEnvironment;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.test.context.junit4.SpringRunner;

/**
 * @author Siva
 *
 */
@RunWith(SpringRunner.class)
@SpringBootTest(webEnvironment=WebEnvironment.RANDOM_PORT)
public class PingControllerTests {
	
	@Autowired
	TestRestTemplate restTemplate;
	
	@Test
	public void testPing() throws Exception
	{
		ResponseEntity<String> respEntity = 
				restTemplate
				.withBasicAuth("admin", "admin123")
				.getForEntity("/ping", String.class);
		assertThat(respEntity.getStatusCode()).isEqualTo(HttpStatus.OK);
		assertThat(respEntity.getBody()).isEqualTo("OK");
	}
}
