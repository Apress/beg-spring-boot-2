/**
 * 
 */
package com.apress.demo.config;

import javax.servlet.DispatcherType;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.web.servlet.FilterRegistrationBean;
import org.springframework.boot.web.servlet.ServletListenerRegistrationBean;
import org.springframework.boot.web.servlet.ServletRegistrationBean;
import org.springframework.context.MessageSource;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.validation.Validator;
import org.springframework.validation.beanvalidation.LocalValidatorFactoryBean;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import com.apress.demo.web.MyFilter;
import com.apress.demo.web.MyServlet;

import net.bull.javamelody.MonitoringFilter;
import net.bull.javamelody.SessionListener;

/**
 * @author Siva
 *
 */
@Configuration
public class WebMvcConfig implements WebMvcConfigurer
{

	@Autowired
    private MessageSource messageSource;

	@Autowired
	private MyServlet myServlet;
	
    @Override
    public Validator getValidator() {
        LocalValidatorFactoryBean factory = new LocalValidatorFactoryBean();
        factory.setValidationMessageSource(messageSource);
        return factory;
    }
    
    @Bean
   	public ServletRegistrationBean<MyServlet> myServletBean() {

    	ServletRegistrationBean<MyServlet> servlet = new ServletRegistrationBean<>();
    	servlet.setServlet(myServlet);
    	servlet.addUrlMappings("/myServlet");
   		return servlet;
   	}
    
    @Bean
	public FilterRegistrationBean<MyFilter> myFilterBean() {

		FilterRegistrationBean<MyFilter> filter = new FilterRegistrationBean<>();
		filter.setFilter(new MyFilter());
		filter.addUrlPatterns("/*");
		return filter;
	}
    
	@Bean(name = "javamelodyFilter")
	public FilterRegistrationBean<MonitoringFilter> javamelodyFilterBean() {

		FilterRegistrationBean<MonitoringFilter> registration = new FilterRegistrationBean<>();
		registration.setFilter(new MonitoringFilter());
		registration.addUrlPatterns("/*");
		registration.setName("javamelodyFilter");
		registration.setAsyncSupported(true);
		registration.setDispatcherTypes(DispatcherType.REQUEST, DispatcherType.ASYNC);
		return registration;
	}

	@Bean(name = "javamelodySessionListener")
	public ServletListenerRegistrationBean<SessionListener> sessionListener() {
		return new ServletListenerRegistrationBean<>(new SessionListener());
	}
	
}
