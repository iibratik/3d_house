package homelink.homelink.data;

import homelink.homelink.data.dto.Developer;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;

public class Developers {
    private DataConnection dataConnection;

    public Developers(DataConnection dataConnection) {
        this.dataConnection = dataConnection;
    }

    public ArrayList<Developer> getAllDevelopers(){
        ArrayList <Developer> all=new ArrayList<>();
        try(Connection connection=dataConnection.getConnection();
            PreparedStatement preparedStatement= connection.prepareStatement("SELECT id, name, description, logo_url FROM developers")){
            ResultSet result= preparedStatement.executeQuery();
            while(result.next()){
                Developer developer=new Developer();
                    developer.setId(result.getInt(1));
                    developer.setName(result.getString(2));
                    developer.setDescription(result.getString(3));
                    developer.setLogo(result.getString(4));
                all.add(developer);
            }
            return all;
        }catch (SQLException e){
            e.printStackTrace();
        }
        throw new RuntimeException("Something went wrong in getAllDevelopers");
    }
    public ArrayList<Developer> getDeveloperById(int id){
        ArrayList <Developer> all=new ArrayList<>();
        try(Connection connection=dataConnection.getConnection();
            PreparedStatement preparedStatement= connection.prepareStatement("SELECT id, name, description, logo_url FROM developers WHERE id=?")){
            ResultSet result= preparedStatement.executeQuery();
            while(result.next()){
                Developer developer=new Developer();
                    developer.setId(result.getInt(1));
                    developer.setName(result.getString(2));
                    developer.setDescription(result.getString(3));
                    developer.setLogo(result.getString(4));
                all.add(developer);
            }
            return all;
        }catch (SQLException e){
            e.printStackTrace();
        }
        throw new RuntimeException("Something went wrong in getDeveloperById");
    }
}