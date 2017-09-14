/**
 * 
 */
package com.apress.demo.services;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.apress.demo.entities.User;
import com.apress.demo.repositories.UserRepository;

/**
 * @author Siva
 *
 */
@Service
@Transactional
public class UserService {
	
	@Autowired UserRepository userRepository;
	
	public Optional<User> login(String email, String password)
	{
		return userRepository.findByEmailAndPassword(email, password);
	}
	
	public User createUser(User user)
	{
		return userRepository.save(user);
	}
	
}
