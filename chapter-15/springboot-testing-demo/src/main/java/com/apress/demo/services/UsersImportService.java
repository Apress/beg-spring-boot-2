
package com.apress.demo.services;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.apress.demo.entities.User;
import com.apress.demo.exceptions.UserImportServiceCommunicationFailure;
import com.apress.demo.model.UsersImportResponse;

/**
 * @author Siva
 *
 */
@Service
@Transactional
public class UsersImportService
{
	
	@Autowired
	private UsersImporter usersImporter;
	
	
	public UsersImportResponse importUsers() {
		int retryCount = 0;
		int maxRetryCount = 3;
		for (int i = 0; i < maxRetryCount; i++)
		{
			try
			{
				List<User> importUsers = usersImporter.importUsers();
				System.out.println("Import Users: "+importUsers);
				break;
			} catch (UserImportServiceCommunicationFailure e)
			{
				retryCount++;
				System.err.println("Error: "+e.getMessage());
			}
		}
		if(retryCount >= maxRetryCount)
			return new UsersImportResponse(retryCount, "FAILURE");
		else
			return new UsersImportResponse(0, "SUCCESS");
	}
}
