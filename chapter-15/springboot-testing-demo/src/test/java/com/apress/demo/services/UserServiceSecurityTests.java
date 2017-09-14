package com.apress.demo.services;

import static org.junit.Assert.*;

import java.util.Optional;

import org.junit.After;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.context.SpringBootTest.WebEnvironment;
import org.springframework.context.ApplicationContext;
import org.springframework.security.authentication.AuthenticationCredentialsNotFoundException;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.junit4.SpringRunner;

import com.apress.demo.entities.User;
import com.apress.demo.services.UserService;

/**
 * @author Siva
 *
 */
@RunWith(SpringRunner.class)
@SpringBootTest(webEnvironment=WebEnvironment.RANDOM_PORT)
public class UserServiceSecurityTests
{
	@Autowired
	private UserService userService;
	
	@Autowired
	private ApplicationContext context;

	private Authentication authentication;
	
	@Before
	public void init() {
		AuthenticationManager authenticationManager = this.context.getBean(AuthenticationManager.class);
		this.authentication = authenticationManager.authenticate(
				new UsernamePasswordAuthenticationToken("admin", "admin123"));
	}

	@After
	public void close() {
		SecurityContextHolder.clearContext();
	}
	
	@Test
	public void testGetUserById() {
		Optional<User> user = userService.findUserById(1);
		assertTrue(user.isPresent());
	}
	
	@Test(expected = AuthenticationCredentialsNotFoundException.class)
	public void deleteUserUnauthenticated() {
		userService.deleteUser(3);
	}
	
	@Test
	public void deleteUserAuthenticated() {
		SecurityContextHolder.getContext().setAuthentication(this.authentication);
		userService.deleteUser(3);
	}
	
	@Test
	@WithMockUser//(username="admin")
	public void createUserWithMockUser() {
		User user = new User();
		user.setName("Yosin");
		user.setEmail("yosin@gmail.com");
		user.setPassword("yosin123");
		
		userService.createUser(user);
	}
	
	/*
	@Test
	@WithUserDetails
	public void createUserWithUserDetails()
	{
		User user = new User();
		user.setName("Yosin");
		user.setEmail("yosin@gmail.com");
		user.setPassword("yosin123");
		
		userService.createUser(user);
	}
	*/
	
	@Test
	@WithMockUser
	public void updateUserWithMockUser() {
		User user = userService.findUserById(1).get();
		user.setName("Yo");
		userService.updateUser(user);
	}
	
	@Test
	@WithMockUser(username="admin",roles={"USER","ADMIN"})
	public void deleteUserAuthenticatedWithMockUser() {
		userService.deleteUser(2);
	}

}
