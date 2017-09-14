/**
 * 
 */
package com.apress.demo.controllers;

import static org.mockito.ArgumentMatchers.any;
import static org.hamcrest.CoreMatchers.*;
import static org.mockito.BDDMockito.*;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.user;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.util.Optional;

import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.result.MockMvcResultMatchers;

import com.fasterxml.jackson.databind.ObjectMapper;

import com.apress.demo.SpringbootTestingDemoApplication;
import com.apress.demo.config.WebSecurityConfig;
import com.apress.demo.entities.Todo;
import com.apress.demo.repositories.TodoRepository;



/**
 * @author Siva
 *
 */
@RunWith(SpringRunner.class)
@WebMvcTest(controllers= TodoRestController.class, secure=false)
@ContextConfiguration(classes={SpringbootTestingDemoApplication.class, WebSecurityConfig.class})
public class TodoRestControllerTests {

	@Autowired
    private MockMvc mvc;

    @MockBean
    private TodoRepository todoRepository;

    @Autowired
    private ObjectMapper objectMapper;
    
    @Test
    public void testFindTodoById() throws Exception {
    	Todo todo = new Todo(1, "Todo1", false);
    	
        given(this.todoRepository.findById(1)).willReturn(Optional.of(todo));
        
        this.mvc.perform(get("/api/todos/1")
        		.with(user("admin").password("admin123").roles("USER","ADMIN"))
        		.accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id", is(1)))
                .andExpect(jsonPath("$.text", is("Todo1")))
                .andExpect(jsonPath("$.done", is(false)));
 
        verify(todoRepository, times(1)).findById(1);
    }
    
    @Test
    public void testCreateTodo() throws Exception {
    	Todo todo = new Todo(null, "New Todo1", false);
    	String content = objectMapper.writeValueAsString(todo);
    	
        given(this.todoRepository.save(any(Todo.class))).willReturn(todo);
        
        this.mvc.perform(post("/api/todos")
        		.contentType(MediaType.APPLICATION_JSON_VALUE)
        		.content(content)
        		.with(csrf())
        		.with(user("admin").password("admin123").roles("USER","ADMIN"))
        		.accept(MediaType.APPLICATION_JSON_VALUE))
        		.andExpect(status().isOk())
        		.andExpect(MockMvcResultMatchers.content().json(content))
                .andReturn()
                ;
        verify(todoRepository, times(1)).save(any(Todo.class));
    }
}
