package com.apress.demo.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.annotation.Secured;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import com.apress.demo.services.UserService;

/**
 * @author Siva
 *
 */
@RestController
public class AdminRestController
{
	@Autowired
	private UserService userService;
	
	@Secured("ROLE_ADMIN")
	@DeleteMapping("/admin/users/{id}")
	public void deleteUser(@PathVariable("id") Integer userId)
	{
		userService.deleteUser(userId);
		System.err.println("User deleted");
	}
}
