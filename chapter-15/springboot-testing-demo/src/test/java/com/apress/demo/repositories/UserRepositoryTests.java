/**
 * 
 */
package com.apress.demo.repositories;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase.Replace;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.test.context.junit4.SpringRunner;

import com.apress.demo.entities.User;

/**
 * @author Siva
 *
 */
@RunWith(SpringRunner.class)
@DataJpaTest
@AutoConfigureTestDatabase(replace=Replace.NONE)
public class UserRepositoryTests {

	@Autowired
    private UserRepository repository;

    @Test
    public void testFindUserByEmail() throws Exception {
        User user = this.repository.findByEmail("admin@gmail.com");
        assertThat(user.getEmail()).isEqualTo("admin@gmail.com");
        assertThat(user.getPassword()).isEqualTo("admin");
    }
    
}
