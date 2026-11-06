// Tác giả & coder: Thanh Vuong CE190182
package fu.se.a3vuongvt_ce191082.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;

@Entity
@Table(name = "RoomInformation")
public class RoomInformation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "RoomID")
    private Integer roomId;

    @NotBlank(message = "Số phòng (RoomNumber) không được để trống!")
    @Column(name = "RoomNumber", nullable = false, length = 50)
    private String roomNumber;

    @Column(name = "RoomDetailDescription", length = 220)
    private String roomDetailDescription;

    @NotNull(message = "Sức chứa tối đa (RoomMaxCapacity) không được để trống!")
    @Column(name = "RoomMaxCapacity")
    private Integer roomMaxCapacity;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "RoomTypeID", nullable = false)
    private RoomType roomType;

    @Column(name = "RoomStatus", columnDefinition = "tinyint")
    private Short roomStatus = 1;

    @NotNull(message = "Giá phòng mỗi ngày (RoomPricePerDay) không được để trống!")
    @Column(name = "RoomPricePerDay", columnDefinition = "money")
    private BigDecimal roomPricePerDay;

    public RoomInformation() {
    }

    public Integer getRoomId() {
        return roomId;
    }

    public void setRoomId(Integer roomId) {
        this.roomId = roomId;
    }

    public String getRoomNumber() {
        return roomNumber;
    }

    public void setRoomNumber(String roomNumber) {
        this.roomNumber = roomNumber;
    }

    public String getRoomDetailDescription() {
        return roomDetailDescription;
    }

    public void setRoomDetailDescription(String roomDetailDescription) {
        this.roomDetailDescription = roomDetailDescription;
    }

    public Integer getRoomMaxCapacity() {
        return roomMaxCapacity;
    }

    public void setRoomMaxCapacity(Integer roomMaxCapacity) {
        this.roomMaxCapacity = roomMaxCapacity;
    }

    public RoomType getRoomType() {
        return roomType;
    }

    public void setRoomType(RoomType roomType) {
        this.roomType = roomType;
    }

    public Integer getRoomStatus() {
        return roomStatus != null ? roomStatus.intValue() : 1;
    }

    public void setRoomStatus(Integer roomStatus) {
        this.roomStatus = roomStatus != null ? roomStatus.shortValue() : (short) 1;
    }

    public BigDecimal getRoomPricePerDay() {
        return roomPricePerDay;
    }

    public void setRoomPricePerDay(BigDecimal roomPricePerDay) {
        this.roomPricePerDay = roomPricePerDay;
    }
}
