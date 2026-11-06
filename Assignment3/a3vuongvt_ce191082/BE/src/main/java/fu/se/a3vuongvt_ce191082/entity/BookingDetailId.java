// Tác giả & coder: Thanh Vuong CE190182
package fu.se.a3vuongvt_ce191082.entity;

import java.io.Serializable;
import java.util.Objects;

public class BookingDetailId implements Serializable {

    private Integer bookingReservationId;
    private Integer roomId;

    public BookingDetailId() {
    }

    public BookingDetailId(Integer bookingReservationId, Integer roomId) {
        this.bookingReservationId = bookingReservationId;
        this.roomId = roomId;
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

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof BookingDetailId that)) return false;
        return Objects.equals(bookingReservationId, that.bookingReservationId)
                && Objects.equals(roomId, that.roomId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(bookingReservationId, roomId);
    }
}
