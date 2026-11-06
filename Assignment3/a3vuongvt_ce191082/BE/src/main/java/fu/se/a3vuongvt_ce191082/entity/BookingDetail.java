// Tác giả & coder: Thanh Vuong CE190182
package fu.se.a3vuongvt_ce191082.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "BookingDetail")
@IdClass(BookingDetailId.class)
public class BookingDetail {

    @Id
    @Column(name = "BookingReservationID")
    private Integer bookingReservationId;

    @Id
    @Column(name = "RoomID")
    private Integer roomId;

    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "BookingReservationID", insertable = false, updatable = false)
    private BookingReservation bookingReservation;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "RoomID", insertable = false, updatable = false)
    private RoomInformation room;

    @Column(name = "StartDate", nullable = false)
    private LocalDate startDate;

    @Column(name = "EndDate", nullable = false)
    private LocalDate endDate;

    @Column(name = "ActualPrice", columnDefinition = "money")
    private BigDecimal actualPrice;

    public BookingDetail() {
    }

    public Integer getBookingReservationId() {
        return bookingReservationId;
    }

    public void setBookingReservationId(Integer bookingReservationId) {
        this.bookingReservationId = bookingReservationId;
    }

    public Integer getRoomId() {
        return roomId;
    }

    public void setRoomId(Integer roomId) {
        this.roomId = roomId;
    }

    public BookingReservation getBookingReservation() {
        return bookingReservation;
    }

    public void setBookingReservation(BookingReservation bookingReservation) {
        this.bookingReservation = bookingReservation;
    }

    public RoomInformation getRoom() {
        return room;
    }

    public void setRoom(RoomInformation room) {
        this.room = room;
    }

    public LocalDate getStartDate() {
        return startDate;
    }

    public void setStartDate(LocalDate startDate) {
        this.startDate = startDate;
    }

    public LocalDate getEndDate() {
        return endDate;
    }

    public void setEndDate(LocalDate endDate) {
        this.endDate = endDate;
    }

    public BigDecimal getActualPrice() {
        return actualPrice;
    }

    public void setActualPrice(BigDecimal actualPrice) {
        this.actualPrice = actualPrice;
    }
}
