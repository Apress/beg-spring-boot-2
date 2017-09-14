/**
 * 
 */
package com.apress.demo;

import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.domain.Page;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.context.web.WebAppConfiguration;

import com.apress.demo.SpringbootRestAPISecurityDemoApplication;
import com.apress.demo.entities.Post;
import com.apress.demo.rest.model.PostsRequestDTO;
import com.apress.demo.services.BlogService;

/**
 * @author Siva
 *
 */
@RunWith(SpringRunner.class)
@SpringBootTest(classes = SpringbootRestAPISecurityDemoApplication.class)
@WebAppConfiguration
public class SpringbootRestAPISecurityDemoApplicationTests {

	@Autowired
	private BlogService blogService;
	
	@Test
	public void contextLoads() {
	}

	@Test
	public void test_findPosts() {
		PostsRequestDTO postsRequest = new PostsRequestDTO();
		Page<Post> posts = blogService.findPosts(postsRequest );
		System.out.println(posts);
	}
}
