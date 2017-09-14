/**
 *
 *
 */
package com.apress.demo.model;

import java.util.HashMap;
import java.util.Map;

public class ErrorDetails {
	private String errorCode;
    private String errorMessage;
    private String devErrorMessage;
    private Map<String, Object> additionalData = new HashMap<>();
 
	public String getErrorCode() {
		return errorCode;
	}
	public void setErrorCode(String errorCode) {
		this.errorCode = errorCode;
	}
	public String getErrorMessage() {
		return errorMessage;
	}
	public void setErrorMessage(String errorMessage) {
		this.errorMessage = errorMessage;
	}
	public String getDevErrorMessage() {
		return devErrorMessage;
	}
	public void setDevErrorMessage(String devErrorMessage) {
		this.devErrorMessage = devErrorMessage;
	}
	public Map<String, Object> getAdditionalData() {
		return additionalData;
	}
	public void setAdditionalData(Map<String, Object> additionalData) {
		this.additionalData = additionalData;
	}

}
