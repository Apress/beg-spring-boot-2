/**
 * 
 */
package com.apress.demo.rest.model;

import java.util.ArrayList;
import java.util.List;

/**
 * @author Siva
 *
 */
public class AuthenticatedUser {

	private String email;
	private List<String> roles = new ArrayList<>();
	
	public AuthenticatedUser(String email, List<String> roles) {
		this.email = email;
		this.roles = roles;
	}

	public String getEmail() {
		return email;
	}

	public List<String> getRoles() {
		return roles;
	}

}
