/**
 * 
 */
package com.apress.demo.controllers;

import java.util.HashMap;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.tomcat.util.http.fileupload.FileUploadBase.FileSizeLimitExceededException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.multipart.MaxUploadSizeExceededException;
import org.springframework.web.multipart.MultipartException;
import org.springframework.web.servlet.ModelAndView;

/**
 * @author Siva
 *
 */
@ControllerAdvice
public class GlobalExceptionHandler {
	@ExceptionHandler({MultipartException.class, FileSizeLimitExceededException.class, MaxUploadSizeExceededException.class})
    public ModelAndView handleMaxUploadException(Exception e, 
    		HttpServletRequest request, HttpServletResponse response){
		Map<String, Object> model = new HashMap<String, Object>();
        model.put("msg", e.getMessage());
        return new ModelAndView("fileUpload", model);
    }
}
