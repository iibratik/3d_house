package homelink.homelink.service;

import com.google.gson.Gson;
import homelink.homelink.data.Apartments;
import homelink.homelink.data.dto.Apartment;
import homelink.homelink.data.dto.Complex;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;

@Service
public class ApartmentService {
    private Apartments apartments;
@Autowired
    public ApartmentService(Apartments apartments) {
        this.apartments = apartments;
    }
    public String getAllApartments(){
        Gson gson=new Gson();
        String allApartments="";
        ArrayList<Apartment> allList=apartments.getAllApartments();
        allApartments=gson.toJson(allList);
        return allApartments;
    }
    public String getApartmentByBlockId(int blockId){
        Gson gson=new Gson();
        String allApartments="";
        ArrayList<Apartment> allList=apartments.getAllApartmentsFromBlock(blockId);
        allApartments=gson.toJson(allList);
        return allApartments;
    }
    public String getAllComplexes(){
        Gson gson=new Gson();
        String allApartments="";
        ArrayList<Complex> allList=apartments.getAllComplexes();
        allApartments=gson.toJson(allList);
        return allApartments;
    }
    public String getComplexByDeveloperId(int developerId){
        Gson gson=new Gson();
        String allApartments="";
        ArrayList<Complex> allList=apartments.getComplexesByDeveloperId(developerId);
        allApartments=gson.toJson(allList);
        return allApartments;
    }
}