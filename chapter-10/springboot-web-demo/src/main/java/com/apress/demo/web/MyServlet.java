/**
 * 
 */
package com.apress.demo.web;

import java.io.IOException;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.apress.demo.services.UserService;

/**
 * @author Siva
 *
 */
@Component
public class MyServlet extends HttpServlet
{
	private static final long serialVersionUID = 1L;

	@Autowired
	private UserService userService;
	@Override
	protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
		resp.getWriter().write(userService.getMessage());
	}
}
