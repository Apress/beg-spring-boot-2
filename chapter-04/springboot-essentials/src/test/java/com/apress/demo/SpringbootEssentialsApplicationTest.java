package com.apress.demo;

import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.junit4.SpringRunner;

import com.apress.demo.DataSourceConfig;
import com.apress.demo.SpringbootEssentialsApplication;

/**
 * @author Siva
 *
 */
@ActiveProfiles("test")
@RunWith(SpringRunner.class)
@SpringBootTest(classes=SpringbootEssentialsApplication.class)
public class SpringbootEssentialsApplicationTest
{
	@Autowired
	private DataSourceConfig dataSourceConfig;
	
	@Test
	public void testContextLoads()
	{
		System.out.println(dataSourceConfig);
	}

}
