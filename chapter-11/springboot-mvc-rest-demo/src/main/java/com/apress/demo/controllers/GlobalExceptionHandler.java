/**
 *
 *
 */
package com.apress.demo.controllers;

import java.io.PrintWriter;
import java.io.StringWriter;
import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.Errors;
import org.springframework.validation.ObjectError;
import org.springframework.web.bind.ServletRequestBindingException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import com.apress.demo.exceptions.ValidationException;
import com.apress.demo.model.ErrorDetails;


@ControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(ValidationException.class)
    public ResponseEntity<?> validationException(ValidationException e) {
        ErrorDetails errorDetails = new ErrorDetails();
        Errors errors = e.getErrors();
        if (errors.hasErrors()) {
        	StringBuilder errorMsg = new StringBuilder(); 
        	List<ObjectError> allErrors = errors.getAllErrors();
        	for (ObjectError objectError : allErrors) {
				errorMsg.append(objectError.getDefaultMessage()+"\n");
			}
        	errorDetails.setErrorMessage(errorMsg.toString());
        }
        errorDetails.setDevErrorMessage(getStackTraceAsString(e));
        return new ResponseEntity<>(errorDetails, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(ServletRequestBindingException.class)
    public ResponseEntity<?> servletRequestBindingException(ServletRequestBindingException e) {
    	ErrorDetails errorDetails = new ErrorDetails();
    	errorDetails.setErrorMessage(e.getMessage());
    	errorDetails.setDevErrorMessage(getStackTraceAsString(e));
        return new ResponseEntity<>(errorDetails, HttpStatus.BAD_REQUEST);
    }


    @ExceptionHandler(Exception.class)
    public ResponseEntity<?> exception(Exception e) {
    	ErrorDetails errorDetails = new ErrorDetails();
    	errorDetails.setErrorMessage(e.getMessage());
        errorDetails.setDevErrorMessage(getStackTraceAsString(e));
        return new ResponseEntity<>(errorDetails, HttpStatus.INTERNAL_SERVER_ERROR);
    }
    
    private String getStackTraceAsString(Exception e)
    {
    	StringWriter sw = new StringWriter();
        PrintWriter pw = new PrintWriter(sw);
        e.printStackTrace(pw);
        return sw.toString();
    }
}
