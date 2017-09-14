
package com.apress.demo.controllers;

import java.io.File;
import java.nio.file.Files;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

/**
 * @author Siva
 *
 */
@Controller
public class FileUploadController
{
	private static final String UPLOADS_DIR = "D:/uploads/";

	@RequestMapping({ "/fileUpload"})
	public String home(Model model) {
		return "fileUpload";
	}
	
	@RequestMapping(value = "/uploadMyFile", method = RequestMethod.POST)
	public String handleFileUpload(@RequestParam("myFile") MultipartFile file, 
			RedirectAttributes redirectAtttributes) {
		if (!file.isEmpty()) {
			String name = file.getOriginalFilename();
			try {
				byte[] bytes = file.getBytes();
				File uploadingDir = new File(UPLOADS_DIR);
				if(!uploadingDir.exists()){
					uploadingDir.mkdirs();
				}
				Files.write(new File(UPLOADS_DIR + name).toPath(), bytes);				
				redirectAtttributes.addFlashAttribute("msg", "File " + name + " uploaded successfully");
			} catch (Exception e) {
				redirectAtttributes.addFlashAttribute("msg", "Failed to upload file" + name + ". Cause: " + e.getMessage());
				e.printStackTrace();
			}
		}
		return "redirect:/fileUpload";
	}
	
}
