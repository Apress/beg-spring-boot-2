package com.apress.demo;

import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.context.web.WebAppConfiguration;

import com.apress.demo.SpringbootWarDemoApplication;

@RunWith(SpringRunner.class)
@SpringBootTest(classes = SpringbootWarDemoApplication.class)
@WebAppConfiguration
public class SpringbootWarDemoApplicationTests {

	@Test
	public void contextLoads() {
	}

}
