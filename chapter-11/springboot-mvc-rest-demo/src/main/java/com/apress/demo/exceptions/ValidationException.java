/**
*
*
*/
package com.apress.demo.exceptions;

import org.springframework.validation.Errors;

public class ValidationException extends RuntimeException
{
	private static final long serialVersionUID = 1L;
	private Errors errors;
	public ValidationException(Errors errors)
	{
		this.errors = errors;
	}
	public Errors getErrors()
	{
		return errors;
	}
	/*private static String getAsString(Errors errors)
	{
		StringBuilder sb = new StringBuilder();
		if(errors.hasErrors()){
			List<ObjectError> allErrors = errors.getAllErrors();
			for (ObjectError objectError : allErrors)
			{
				sb.append(objectError.getDefaultMessage()+"\n");
			}
		}
		return(sb.toString());
	}*/
}
