package homelink.homelink.data;

import homelink.homelink.data.dto.Apartment;
import homelink.homelink.data.dto.Complex;
import homelink.homelink.data.dto.Types;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;

@Component
public class Apartments {
    private DataConnection dataConnection;
    @Autowired
    public Apartments(DataConnection dataConnection){
        this.dataConnection=dataConnection;
    }
    public ArrayList<Types> getApartmentType(){
        ArrayList <Types> all=new ArrayList<>();
        try(Connection connection=dataConnection.getConnection();
                PreparedStatement preparedStatement= connection.prepareStatement("SELECT * FROM apartment_types")){
            ResultSet result= preparedStatement.executeQuery();
            while (result.next()){
                Types type=new Types();
                int id=result.getInt(1);
                String apartType=result.getString(2);
                type.setId(id);
                type.setType(apartType);
                all.add(type);
            }
            return all;
        }catch (SQLException e){
            e.printStackTrace();
        }
        throw new RuntimeException("Something went wrong in getApartmentType");
    }

    public ArrayList<Apartment> getAllApartmentsFromBlock (int blockId){
        ArrayList <Apartment> all=new ArrayList<>();
        try(Connection connection=dataConnection.getConnection();
            PreparedStatement preparedStatement= connection.prepareStatement("SELECT * FROM apartments WHERE blockId=?")){
                ResultSet result= preparedStatement.executeQuery();
                while(result.next()){
                    Apartment apartment=new Apartment();
                        apartment.setId(result.getInt(1));
                        apartment.setBlockId(result.getInt(2));
                        apartment.setApartmentNumber(result.getString(3));
                        apartment.setFloor(result.getInt(4));
                        apartment.setTypeId(result.getInt(5));
                    all.add(apartment);
                }
                return all;
        }catch (SQLException e){
            e.printStackTrace();
        }
        throw new RuntimeException("Something went wrong in getAllApartmentsFromBlock");
    }
    public ArrayList<Apartment> getAllApartments (){
        ArrayList <Apartment> all=new ArrayList<>();
        try(Connection connection=dataConnection.getConnection();
            PreparedStatement preparedStatement= connection.prepareStatement("SELECT * FROM apartments")){
            ResultSet result= preparedStatement.executeQuery();
            while(result.next()){
                Apartment apartment=new Apartment();
                apartment.setId(result.getInt(1));
                apartment.setBlockId(result.getInt(2));
                apartment.setApartmentNumber(result.getString(3));
                apartment.setFloor(result.getInt(4));
                apartment.setTypeId(result.getInt(5));
                all.add(apartment);
            }
            return all;
        }catch (SQLException e){
            e.printStackTrace();
        }
        throw new RuntimeException("Something went wrong in getAllApartments");
    }
    public ArrayList<Complex> getAllComplexes (){
        ArrayList <Complex> all=new ArrayList<>();
        try(Connection connection=dataConnection.getConnection();
            PreparedStatement preparedStatement= connection.prepareStatement("SELECT * FROM residential_complexes")){
            ResultSet result= preparedStatement.executeQuery();
            while(result.next()){
                Complex complex=new Complex();
                complex.setId(result.getInt(1));
                complex.setDeveloperId(result.getInt(2));
                complex.setName(result.getString(3));
                complex.setAddress(result.getString(4));
                all.add(complex);
            }
            return all;
        }catch (SQLException e){
            e.printStackTrace();
        }
        throw new RuntimeException("Something went wrong in getAllApartments");
    }
    public ArrayList<Complex> getComplexesByDeveloperId (int developerId){
        ArrayList <Complex> all=new ArrayList<>();
        try(Connection connection=dataConnection.getConnection();
            PreparedStatement preparedStatement= connection.prepareStatement("SELECT * FROM residential_complexes WHERE developer_id=?")){
            ResultSet result= preparedStatement.executeQuery();
            while(result.next()){
                Complex complex=new Complex();
                complex.setId(result.getInt(1));
                complex.setDeveloperId(result.getInt(2));
                complex.setName(result.getString(3));
                complex.setAddress(result.getString(4));
                all.add(complex);
            }
            return all;
        }catch (SQLException e){
            e.printStackTrace();
        }
        throw new RuntimeException("Something went wrong in getAllApartments");
    }
}
