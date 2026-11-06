// Tác giả & coder: Thanh Vuong CE190182
package fu.se.a3vuongvt_ce191082.service;

import fu.se.a3vuongvt_ce191082.entity.RoomInformation;
import fu.se.a3vuongvt_ce191082.entity.RoomType;
import fu.se.a3vuongvt_ce191082.repository.BookingDetailRepository;
import fu.se.a3vuongvt_ce191082.repository.RoomInformationRepository;
import fu.se.a3vuongvt_ce191082.repository.RoomTypeRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class RoomService {

    private final RoomInformationRepository roomRepository;
    private final RoomTypeRepository roomTypeRepository;
    private final BookingDetailRepository bookingDetailRepository;

    public RoomService(
            RoomInformationRepository roomRepository,
            RoomTypeRepository roomTypeRepository,
            BookingDetailRepository bookingDetailRepository
    ) {
        this.roomRepository = roomRepository;
        this.roomTypeRepository = roomTypeRepository;
        this.bookingDetailRepository = bookingDetailRepository;
    }

    public List<RoomInformation> getPublicRooms(String keyword, Integer roomTypeId) {
        List<RoomInformation> all = roomRepository.findAll();
        return all.stream()
                .filter(r -> {
                    if (roomTypeId != null && (r.getRoomType() == null || !roomTypeId.equals(r.getRoomType().getRoomTypeId()))) {
                        return false;
                    }
                    if (keyword != null && !keyword.trim().isEmpty()) {
                        String kw = keyword.trim().toLowerCase();
                        boolean matchNumber = r.getRoomNumber() != null && r.getRoomNumber().toLowerCase().contains(kw);
                        boolean matchDesc = r.getRoomDetailDescription() != null && r.getRoomDetailDescription().toLowerCase().contains(kw);
                        boolean matchType = r.getRoomType() != null && r.getRoomType().getRoomTypeName() != null
                                && r.getRoomType().getRoomTypeName().toLowerCase().contains(kw);
                        return matchNumber || matchDesc || matchType;
                    }
                    return true;
                })
                .collect(Collectors.toList());
    }

    public List<RoomInformation> getAllRooms(String keyword) {
        return getPublicRooms(keyword, null);
    }

    public RoomInformation getRoomById(Integer id) {
        return roomRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy phòng với ID: " + id));
    }

    public RoomInformation createRoom(RoomInformation room, Integer roomTypeId) {
        validateRoom(room, roomTypeId);
        String cleanNumber = room.getRoomNumber().trim();
        Optional<RoomInformation> existing = roomRepository.findByRoomNumberIgnoreCase(cleanNumber);
        if (existing.isPresent()) {
            throw new IllegalArgumentException("Số phòng '" + cleanNumber + "' đã tồn tại trong hệ thống!");
        }
        RoomType roomType = roomTypeRepository.findById(roomTypeId)
                .orElseThrow(() -> new IllegalArgumentException("Loại phòng (RoomType) không tồn tại!"));

        room.setRoomId(null);
        room.setRoomNumber(cleanNumber);
        room.setRoomType(roomType);
        if (room.getRoomStatus() == null) {
            room.setRoomStatus(1);
        }
        return roomRepository.save(room);
    }

    public RoomInformation updateRoom(Integer id, RoomInformation updated, Integer roomTypeId) {
        RoomInformation existing = getRoomById(id);
        validateRoom(updated, roomTypeId);

        String cleanNumber = updated.getRoomNumber().trim();
        Optional<RoomInformation> byNumber = roomRepository.findByRoomNumberIgnoreCase(cleanNumber);
        if (byNumber.isPresent() && !byNumber.get().getRoomId().equals(id)) {
            throw new IllegalArgumentException("Số phòng '" + cleanNumber + "' đã được sử dụng bởi phòng khác!");
        }

        RoomType roomType = roomTypeRepository.findById(roomTypeId)
                .orElseThrow(() -> new IllegalArgumentException("Loại phòng (RoomType) không tồn tại!"));

        existing.setRoomNumber(cleanNumber);
        existing.setRoomDetailDescription(updated.getRoomDetailDescription());
        existing.setRoomMaxCapacity(updated.getRoomMaxCapacity());
        existing.setRoomPricePerDay(updated.getRoomPricePerDay());
        existing.setRoomStatus(updated.getRoomStatus() != null ? updated.getRoomStatus() : 1);
        existing.setRoomType(roomType);
        return roomRepository.save(existing);
    }

    /**
     * Đề bài yêu cầu:
     * "The delete action will delete room information in the case this information is not belong to any renting transaction.
     * If the room information is already stored in a booking detail, just change the status."
     */
    public Map<String, Object> deleteRoom(Integer id) {
        RoomInformation existing = getRoomById(id);
        boolean usedInBooking = bookingDetailRepository.existsByRoomId(id);
        if (usedInBooking) {
            existing.setRoomStatus(0);
            roomRepository.save(existing);
            return Map.of(
                    "action", "STATUS_CHANGED",
                    "message", "Phòng \"" + existing.getRoomNumber()
                            + "\" đã nằm trong giao dịch đặt phòng (BookingDetail), hệ thống đã đổi trạng thái sang Inactive (0)!"
            );
        } else {
            roomRepository.delete(existing);
            return Map.of(
                    "action", "DELETED",
                    "message", "Đã xóa vĩnh viễn phòng \"" + existing.getRoomNumber() + "\" khỏi cơ sở dữ liệu!"
            );
        }
    }

    public List<RoomType> getAllRoomTypes() {
        return roomTypeRepository.findAll();
    }

    public RoomType createRoomType(RoomType roomType) {
        if (roomType.getRoomTypeName() == null || roomType.getRoomTypeName().trim().isEmpty()) {
            throw new IllegalArgumentException("Tên loại phòng (RoomTypeName) không được để trống!");
        }
        roomType.setRoomTypeId(null);
        roomType.setRoomTypeName(roomType.getRoomTypeName().trim());
        return roomTypeRepository.save(roomType);
    }

    private void validateRoom(RoomInformation room, Integer roomTypeId) {
        if (room.getRoomNumber() == null || room.getRoomNumber().trim().isEmpty()) {
            throw new IllegalArgumentException("Số phòng (RoomNumber) không được để trống!");
        }
        if (roomTypeId == null) {
            throw new IllegalArgumentException("Vui lòng chọn loại phòng (RoomType)!");
        }
        if (room.getRoomMaxCapacity() == null || room.getRoomMaxCapacity() <= 0) {
            throw new IllegalArgumentException("Sức chứa tối đa (RoomMaxCapacity) phải lớn hơn 0!");
        }
        if (room.getRoomPricePerDay() == null || room.getRoomPricePerDay().compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("Giá phòng mỗi ngày (RoomPricePerDay) phải lớn hơn 0!");
        }
    }
}
