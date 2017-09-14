
package com.apress.demo;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Service;
/**
 * @author Siva
 *
 */
@Service
public class MongoUserService
{
	@Autowired
	private MongoTemplate mongoTemplate;
	
	public List<User> getUsers()
	{
		return mongoTemplate.findAll(User.class, "users");
	}
	
	public User getUser(Integer id)
	{
		Query query = Query.query(Criteria.where("id").is(id));
		return mongoTemplate.findOne(query , User.class);
	}
	
	public void createUser(User user)
	{
		mongoTemplate.save(user, "users");
	}
	
}
