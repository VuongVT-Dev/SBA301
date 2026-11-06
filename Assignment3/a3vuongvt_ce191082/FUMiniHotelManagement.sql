USE [master]
GO

IF DB_ID('FUMiniHotelManagement') IS NOT NULL
BEGIN
    ALTER DATABASE [FUMiniHotelManagement] SET SINGLE_USER WITH ROLLBACK IMMEDIATE;
    DROP DATABASE [FUMiniHotelManagement];
END
GO

CREATE DATABASE [FUMiniHotelManagement]
GO
USE [FUMiniHotelManagement]
GO

SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[RoomInformation](
	[RoomID] [int] IDENTITY(1,1) NOT NULL,
	[RoomNumber] [nvarchar](50) NOT NULL,
	[RoomDetailDescription] [nvarchar](220) NULL,
	[RoomMaxCapacity] [int] NULL,
	[RoomTypeID] [int] NOT NULL,
	[RoomStatus] [tinyint] NULL,
	[RoomPricePerDay] [money] NULL,
 CONSTRAINT [PK_RoomInformation] PRIMARY KEY CLUSTERED 
(
	[RoomID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO

SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Customer](
	[CustomerID] [int] IDENTITY(3,1) NOT NULL,
	[CustomerFullName] [nvarchar](50) NULL,
	[Telephone] [nvarchar](12) NULL,
	[EmailAddress] [nvarchar](50) NOT NULL Unique,
	[CustomerBirthday] [date] NULL,
	[CustomerStatus] [tinyint] NULL,
	[Password] [nvarchar](50) NULL,
 CONSTRAINT [PK_Customer] PRIMARY KEY CLUSTERED 
(
	[CustomerID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO

SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[RoomType](
	[RoomTypeID] [int] IDENTITY(1,1) NOT NULL,
	[RoomTypeName] [nvarchar](50) NOT NULL,
	[TypeDescription] [nvarchar](250) NULL,
	[TypeNote] [nvarchar](250) NULL,
 CONSTRAINT [PK_RoomType] PRIMARY KEY CLUSTERED 
(
	[RoomTypeID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO

SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[BookingDetail](
	[BookingReservationID] [int] NOT NULL,
	[RoomID] [int] NOT NULL,
	[StartDate] [date] NOT NULL,
	[EndDate] [date] NOT NULL,
	[ActualPrice] [money] NULL,
 CONSTRAINT [PK_BookingDetail] PRIMARY KEY CLUSTERED 
(
	[BookingReservationID] ASC,
	[RoomID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO

SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[BookingReservation](
	[BookingReservationID] [int] NOT NULL,
	[BookingDate] [date] NULL,
	[TotalPrice] [money] NULL,
	[CustomerID] [int] NOT NULL,
	[BookingStatus] [tinyint] NULL,
 CONSTRAINT [PK_BookingReservation] PRIMARY KEY CLUSTERED 
(
	[BookingReservationID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO

ALTER TABLE [dbo].[RoomInformation]  WITH CHECK ADD  CONSTRAINT [FK_RoomInformation_RoomType] FOREIGN KEY([RoomTypeID])
REFERENCES [dbo].[RoomType] ([RoomTypeID])
ON UPDATE CASCADE
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[RoomInformation] CHECK CONSTRAINT [FK_RoomInformation_RoomType]
GO

ALTER TABLE [dbo].[BookingDetail]  WITH CHECK ADD  CONSTRAINT [FK_BookingDetail_RoomInformation] FOREIGN KEY([RoomID])
REFERENCES [dbo].[RoomInformation] ([RoomID])
ON UPDATE CASCADE
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[BookingDetail] CHECK CONSTRAINT [FK_BookingDetail_RoomInformation]
GO
ALTER TABLE [dbo].[BookingDetail]  WITH CHECK ADD  CONSTRAINT [FK_BookingDetail_BookingReservation] FOREIGN KEY([BookingReservationID])
REFERENCES [dbo].[BookingReservation] ([BookingReservationID])
ON UPDATE CASCADE
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[BookingDetail] CHECK CONSTRAINT [FK_BookingDetail_BookingReservation]
GO
ALTER TABLE [dbo].[BookingReservation]  WITH CHECK ADD  CONSTRAINT [FK_BookingReservation_Customer] FOREIGN KEY([CustomerID])
REFERENCES [dbo].[Customer] ([CustomerID])
ON UPDATE CASCADE
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[BookingReservation] CHECK CONSTRAINT [FK_BookingReservation_Customer]
GO

-- =============================================
-- SEED SAMPLE DATA FOR FUMiniHotelManagement
-- =============================================

SET IDENTITY_INSERT [dbo].[RoomType] ON
INSERT INTO [dbo].[RoomType] ([RoomTypeID], [RoomTypeName], [TypeDescription], [TypeNote]) VALUES
(1, N'Standard Room', N'Phòng tiêu chuẩn đầy đủ tiện nghi cơ bản, giường đôi', N'Bao gồm ăn sáng miễn phí'),
(2, N'Deluxe Room', N'Phòng cao cấp diện tích rộng, ban công hướng biển/thành phố', N'Tặng kèm nước uống chào mừng'),
(3, N'Suite Room', N'Phòng hạng sang có phòng khách riêng biệt và bồn tắm nằm', N'Dịch vụ VIP 24/7'),
(4, N'Family Room', N'Phòng gia đình rộng rãi với 2 giường lớn cho 4 người', N'Phù hợp gia đình hoặc nhóm bạn')
SET IDENTITY_INSERT [dbo].[RoomType] OFF
GO

SET IDENTITY_INSERT [dbo].[RoomInformation] ON
INSERT INTO [dbo].[RoomInformation] ([RoomID], [RoomNumber], [RoomDetailDescription], [RoomMaxCapacity], [RoomTypeID], [RoomStatus], [RoomPricePerDay]) VALUES
(1, N'101', N'Phòng Standard tầng 1, thoáng mát, gần sảnh chính', 2, 1, 1, 500000),
(2, N'102', N'Phòng Standard tầng 1, view sân vườn yên tĩnh', 2, 1, 1, 550000),
(3, N'201', N'Phòng Deluxe tầng 2, có ban công lớn ngắm cảnh', 3, 2, 1, 850000),
(4, N'202', N'Phòng Deluxe tầng 2, nội thất gỗ cao cấp', 3, 2, 1, 900000),
(5, N'301', N'Phòng Suite VIP tầng 3, phòng khách riêng sang trọng', 4, 3, 1, 1500000),
(6, N'401', N'Phòng Family tầng 4, 2 giường đôi lớn cho gia đình', 4, 4, 1, 1200000)
SET IDENTITY_INSERT [dbo].[RoomInformation] OFF
GO

SET IDENTITY_INSERT [dbo].[Customer] ON
INSERT INTO [dbo].[Customer] ([CustomerID], [CustomerFullName], [Telephone], [EmailAddress], [CustomerBirthday], [CustomerStatus], [Password]) VALUES
(3, N'Emma William', N'0901234567', N'EmmaWilliam@FUNewsManagement.org', CAST(N'1995-05-15' AS Date), 1, N'@1'),
(4, N'Olivia James', N'0902345678', N'OliviaJames@FUNewsManagement.org', CAST(N'1998-08-20' AS Date), 1, N'@1'),
(5, N'Isabella David', N'0903456789', N'IsabellaDavid@FUNewsManagement.org', CAST(N'2000-01-10' AS Date), 1, N'@1'),
(6, N'Michael Charlotte', N'0904567890', N'MichaelCharlotte@FUNewsManagement.org', CAST(N'1993-11-25' AS Date), 1, N'@1'),
(7, N'William Shakespeare', N'0912345678', N'WilliamShakespeare@FUMiniHotel.org', CAST(N'1990-04-23' AS Date), 1, N'@1')
SET IDENTITY_INSERT [dbo].[Customer] OFF
GO

INSERT INTO [dbo].[BookingReservation] ([BookingReservationID], [BookingDate], [TotalPrice], [CustomerID], [BookingStatus]) VALUES
(1, CAST(N'2026-10-15' AS Date), 2700000, 3, 1),
(2, CAST(N'2026-10-20' AS Date), 1700000, 4, 1)
GO

INSERT INTO [dbo].[BookingDetail] ([BookingReservationID], [RoomID], [StartDate], [EndDate], [ActualPrice]) VALUES
(1, 1, CAST(N'2026-10-16' AS Date), CAST(N'2026-10-18' AS Date), 1000000),
(1, 3, CAST(N'2026-10-16' AS Date), CAST(N'2026-10-18' AS Date), 1700000),
(2, 2, CAST(N'2026-10-21' AS Date), CAST(N'2026-10-23' AS Date), 1100000),
(2, 1, CAST(N'2026-10-24' AS Date), CAST(N'2026-10-25' AS Date), 600000)
GO

USE [master]
GO
ALTER DATABASE [FUMiniHotelManagement] SET READ_WRITE 
GO
