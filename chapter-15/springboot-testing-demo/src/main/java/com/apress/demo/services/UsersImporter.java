
package com.apress.demo.services;

import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;

import com.apress.demo.entities.User;
import com.apress.demo.exceptions.UserImportServiceCommunicationFailure;

/**
 * @author Siva
 *
 */

@Service
public class UsersImporter
{

	public List<User> importUsers() throws UserImportServiceCommunicationFailure
	{
		//Here 
		List<User> users = new ArrayList<>();
		//get users by invoking some web service
		//if any exception occurs throw UserImportServiceCommunicationFailure
		
		//dummy data
		users.add(new User());
		users.add(new User());
		users.add(new User());
		
		return users;
	}

}
