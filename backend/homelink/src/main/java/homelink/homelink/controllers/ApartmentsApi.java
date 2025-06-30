package homelink.homelink.controllers;

import homelink.homelink.service.ApartmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/apar")
public class ApartmentsApi {
    private ApartmentService service;
    @Autowired
    public ApartmentsApi(ApartmentService service) {
        this.service = service;
    }
    @GetMapping("/get/all")
    @CrossOrigin("http://localhost:7000")
    public String get(){
        return service.getAllComplexes();
    }
}
