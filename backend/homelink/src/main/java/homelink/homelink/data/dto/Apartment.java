package homelink.homelink.data.dto;

public class Apartment {
    private int id;
    private int blockId;
    private String apartmentNumber;
    private int floor;
    private int typeId;
    public Apartment(){}
    public Apartment(int id, int blockId, String apartmentNumber, int floor, int typeId) {
        this.id = id;
        this.blockId = blockId;
        this.apartmentNumber = apartmentNumber;
        this.floor = floor;
        this.typeId = typeId;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public int getBlockId() {
        return blockId;
    }

    public void setBlockId(int blockId) {
        this.blockId = blockId;
    }

    public String getApartmentNumber() {
        return apartmentNumber;
    }

    public void setApartmentNumber(String apartmentNumber) {
        this.apartmentNumber = apartmentNumber;
    }

    public int getFloor() {
        return floor;
    }

    public void setFloor(int floor) {
        this.floor = floor;
    }

    public int getTypeId() {
        return typeId;
    }

    public void setTypeId(int typeId) {
        this.typeId = typeId;
    }
}
