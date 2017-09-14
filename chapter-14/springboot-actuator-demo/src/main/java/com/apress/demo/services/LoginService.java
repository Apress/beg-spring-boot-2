/**
 * 
 */
package com.apress.demo.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.actuate.metrics.CounterService;
import org.springframework.stereotype.Service;

/**
 * @author Siva
 *
 */
@Service
public class LoginService {

	@Autowired
	private CounterService counterService;
	
	public boolean login(String email, String password)
	{
		if("admin@gmail.com".equalsIgnoreCase(email) && "admin".equals(password)){
			counterService.increment("counter.login.success");
			return true;
		} else {
			counterService.increment("counter.login.failure");
			return false;
		}
	}
}
