/**
 * 
 */
package com.apress.demo.rest.endpoints;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.apress.demo.rest.model.AuthenticatedUser;

/**
 * @author Siva
 *
 */
@RestController
@RequestMapping(value="/api/users/", produces=MediaType.APPLICATION_JSON_VALUE)
public class UserRestController 
{
	
	@RequestMapping(value="/authenticatedUser", method=RequestMethod.GET)
	public ResponseEntity<AuthenticatedUser> getAuthenticatedUser() 
	{
		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
		if(authentication!= null)
		{
			Object userDetails = authentication.getPrincipal();
			if(userDetails != null && userDetails instanceof UserDetails)
			{
				UserDetails secUser = (UserDetails) userDetails;
				String username = secUser.getUsername();
				
				List<String> roles = secUser.getAuthorities()
											.stream()
												.map(authority -> authority.getAuthority())
												.collect(Collectors.toList());
				AuthenticatedUser authenticatedUser = new AuthenticatedUser(username, roles);
				return new ResponseEntity<>(authenticatedUser,HttpStatus.OK); 
			}
		}
		return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
	}
}
