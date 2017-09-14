package com.apress.demo.controllers;

import java.io.PrintWriter;
import java.io.StringWriter;
import java.util.List;

import javax.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.validation.ObjectError;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import com.apress.demo.entities.Comment;
import com.apress.demo.entities.Post;
import com.apress.demo.exceptions.PostDeletionException;
import com.apress.demo.exceptions.ResourceNotFoundException;
import com.apress.demo.model.ErrorDetails;
import com.apress.demo.repositories.CommentRepository;
import com.apress.demo.repositories.PostRepository;

/**
 * @author Siva
 * 
 */
@RestController
@RequestMapping(value="/posts")
public class PostController
{
    @Autowired
    PostRepository postRepository;
    
    @Autowired
    CommentRepository commentRepository;
    
   /* @ResponseStatus(HttpStatus.CREATED)
    @PostMapping("")
    public Post createPost(@RequestBody Post post)
    {
        return postRepository.save(post);
    }*/

    @PostMapping("")
    public ResponseEntity<?> createPost(@RequestBody @Valid Post post, BindingResult result)
    {
        if(result.hasErrors()){
        	StringBuilder devErrorMsg = new StringBuilder(); 
        	List<ObjectError> allErrors = result.getAllErrors();
        	for (ObjectError objectError : allErrors) {
				devErrorMsg.append(objectError.getDefaultMessage()+"\n");
			}
        	ErrorDetails errorDetails = new ErrorDetails();
        	errorDetails.setErrorCode("ERR-1400");//Business specific error codes
        	errorDetails.setErrorMessage("Invalid Post data received");
        	errorDetails.setDevErrorMessage(devErrorMsg.toString());
        	
            return new ResponseEntity<>(errorDetails, HttpStatus.BAD_REQUEST);
        }
        Post savedPost = postRepository.save(post);
        HttpHeaders responseHeaders = new HttpHeaders();
        responseHeaders.set("MyResponseHeader", "MyValue");
        return new ResponseEntity<>(savedPost, responseHeaders, HttpStatus.CREATED);
    }
    
    
    @GetMapping("")
    public List<Post> listPosts()
    {
        return postRepository.findAll();
    }
    
    @GetMapping("/{id}")
    public Post getPost(@PathVariable("id") Integer id)
    {
        return postRepository.findById(id)
        		.orElseThrow(() -> new ResourceNotFoundException("No post found with id="+id));
    }
    
    @PutMapping("/{id}")
    public Post updatePost(@PathVariable("id") Integer id, @RequestBody @Valid Post post, BindingResult result)
    {
    	if(result.hasErrors()){
            throw new IllegalArgumentException("Invalod Post data");
        }
        postRepository.findById(id)
        	.orElseThrow(() -> new ResourceNotFoundException("No post found with id="+id));
        return  postRepository.save(post);
    }
    
    @DeleteMapping("/{id}")
    public void deletePost(@PathVariable("id") Integer id)
    {
        Post post = postRepository.findById(id)
        		.orElseThrow(() -> new ResourceNotFoundException("No post found with id="+id));
        try {
			postRepository.deleteById(post.getId());
		} catch (Exception e) {
			throw new PostDeletionException("Post with id="+id+" can't be deleted");
		}        
    }

    @ResponseStatus(HttpStatus.CREATED)
    @PostMapping("/{id}/comments")
    public void createPostComment(@PathVariable("id") Integer id, @RequestBody Comment comment)
    {
        Post post = postRepository.findById(id)
        		.orElseThrow(() -> new ResourceNotFoundException("No post found with id="+id));
        post.getComments().add(comment);
    }
    
    @GetMapping("/{postId}/comments/{commentId}")
    public Comment getPostComment(@PathVariable("postId") Integer postId, 
            @PathVariable("commentId") Integer commentId)
    {
    	return commentRepository.findById(commentId)
    			.orElseThrow(() -> new ResourceNotFoundException("No comment found with id="+commentId));
    }
    
    @DeleteMapping("/{postId}/comments/{commentId}")
    public void deletePostComment(@PathVariable("postId") Integer postId, 
                                  @PathVariable("commentId") Integer commentId)
    {
        commentRepository.deleteById(commentId);
    }
    
    @ExceptionHandler(PostDeletionException.class)
    public ResponseEntity<?> servletRequestBindingException(PostDeletionException e) {
        ErrorDetails errorDetails = new ErrorDetails();        
        errorDetails.setErrorMessage(e.getMessage());
        StringWriter sw = new StringWriter();
        PrintWriter pw = new PrintWriter(sw);
        e.printStackTrace(pw);
        errorDetails.setDevErrorMessage(sw.toString());
        return new ResponseEntity<>(errorDetails, HttpStatus.INTERNAL_SERVER_ERROR);
    }
}
