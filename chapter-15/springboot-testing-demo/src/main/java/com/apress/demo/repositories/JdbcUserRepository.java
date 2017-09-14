
/**
 * 
 */
package com.apress.demo.repositories;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import com.apress.demo.entities.User;

/**
 * @author Siva
 *
 */
@Repository
public class JdbcUserRepository {

	private JdbcTemplate jdbcTemplate;

	@Autowired
	public JdbcUserRepository(JdbcTemplate jdbcTemplate) {
		this.jdbcTemplate = jdbcTemplate;
	}

	public List<User> findAll() {
		return jdbcTemplate.query("select * from people", new RowMapper<User>() {

			@Override
			public User mapRow(ResultSet rs, int n) throws SQLException {
				User u = new User();
				u.setId(rs.getInt("id"));
				u.setName(rs.getString("name"));
				return u;
			}
		});
	}
}
