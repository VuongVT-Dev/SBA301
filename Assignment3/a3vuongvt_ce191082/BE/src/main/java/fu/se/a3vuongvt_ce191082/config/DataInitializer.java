// Tác giả & coder: Thanh Vuong CE190182
package fu.se.a3vuongvt_ce191082.config;

import fu.se.a3vuongvt_ce191082.repository.CustomerRepository;
import fu.se.a3vuongvt_ce191082.repository.RoomInformationRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

    private final CustomerRepository customerRepository;
    private final RoomInformationRepository roomRepository;

    public DataInitializer(CustomerRepository customerRepository, RoomInformationRepository roomRepository) {
        this.customerRepository = customerRepository;
        this.roomRepository = roomRepository;
    }

    @Override
    public void run(String... args) {
        long customers = customerRepository.count();
        long rooms = roomRepository.count();
        System.out.println("FUMiniHotelManagement connected successfully. Customers: " + customers + ", Rooms: " + rooms);
    }
}
