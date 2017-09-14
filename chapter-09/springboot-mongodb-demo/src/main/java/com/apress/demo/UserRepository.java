
package com.apress.demo;
/**
 * @author Siva
 *
 */
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

public interface UserRepository extends MongoRepository<User, String>
{
	@Query("{ 'name' : ?0 }")
	User findByUserName(String name);

}
