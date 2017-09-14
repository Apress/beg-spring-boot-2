/**
 * 
 */
package com.apress.demo.exceptions;

/**
 * @author Siva
 *
 */
public class PostDeletionException extends RuntimeException 
{
	private static final long serialVersionUID = 1L;

	public PostDeletionException() {
        this("Post can't be deleted");
    }

    public PostDeletionException(String message) {
        this(message, null);
    }

    public PostDeletionException(String message, Throwable cause) {
        super(message, cause);
    }
}
