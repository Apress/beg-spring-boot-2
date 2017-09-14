/**
 * 
 */
package com.apress.demo.repositories;

import static org.assertj.core.api.Assertions.assertThat;

import java.util.List;

import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.JdbcTest;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.test.context.junit4.SpringRunner;

import com.apress.demo.entities.User;

/**
 * @author Siva
 *
 */
@RunWith(SpringRunner.class)
@JdbcTest
public class JdbcUserRepositoryTests {

	@Autowired
	private JdbcTemplate jdbcTemplate;

	private JdbcUserRepository userRepository;

	@Before
	public void init() {
		userRepository = new JdbcUserRepository(jdbcTemplate);

		jdbcTemplate.execute("create table people(id int, name varchar(100))");
		jdbcTemplate.execute("insert into people(id, name) values(1, 'John')");
		jdbcTemplate.execute("insert into people(id, name) values(2, 'Remo')");
		jdbcTemplate.execute("insert into people(id, name) values(3, 'Dale')");
	}

	@Test
	public void testFindAllUsers() throws Exception {
		List<User> users = userRepository.findAll();
		assertThat(users.size()).isEqualTo(3);
	}

}
