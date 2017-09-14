/**
 * 
 */
package com.apress.demo.services;

import org.springframework.stereotype.Component;

/**
 * @author Siva
 *
 */
@Component
public class UserService {

	private String message = "This is a test message";
	
	public String getMessage() {
		return message;
	}
}
