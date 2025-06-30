package homelink.homelink.data.dto;

public class Complex {
    private int id;
    private int developerId;
    private String name;
    private String address;

    public Complex(){}
    public Complex(int id, int developerId, String name, String address) {
        this.id = id;
        this.developerId = developerId;
        this.name = name;
        this.address = address;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public int getDeveloperId() {
        return developerId;
    }

    public void setDeveloperId(int developerId) {
        this.developerId = developerId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }
}
