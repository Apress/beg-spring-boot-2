/**
 *
 */
package com.apress.demo.config;

import com.apress.demo.entities.Comment;
import com.apress.demo.entities.Post;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.rest.core.config.RepositoryRestConfiguration;
import org.springframework.data.rest.webmvc.config.RepositoryRestConfigurerAdapter;

import com.apress.demo.entities.User;

/**
 * @author Siva
 */

@Configuration
public class RepositoryConfig extends RepositoryRestConfigurerAdapter {

    @Override
    public void configureRepositoryRestConfiguration(RepositoryRestConfiguration config) {
        config.exposeIdsFor(User.class, Post.class, Comment.class);

        config.getCorsRegistry()
        		.addMapping("/**")
	                //.allowedOrigins("http://localhost:3000")
	        		.allowedOrigins("*")
	                .allowedMethods("HEAD", "OPTIONS", "GET", "POST", "PUT", "DELETE")
	                .allowCredentials(false)
	                .maxAge(3600);
    }
}

