-- API servisinde kullanılan adres isimlerini Address modeli ile uyumlu hale getirme
-- Bu script, önceki kodlarda "address" olarak kullanılan alanı "addressDetail" olarak güncellemek için

-- Alttaki kod, APIController'daki alanların, model ile uyumlu olmaması durumunda kullanılabilir
-- Eğer kodlarda "address" yerine "addressDetail" kullanılıyorsa bu düzeltmeye gerek yok

-- Örnek olarak, Orders tablosunda böyle bir güncelleme gerekirse:
/*
IF COL_LENGTH('Orders', 'ShippingAddress') IS NOT NULL
BEGIN
    -- ShippingAddressDetail alanı eklenmediyse ekle
    IF COL_LENGTH('Orders', 'ShippingAddressDetail') IS NULL
    BEGIN
        ALTER TABLE Orders ADD ShippingAddressDetail nvarchar(200) NULL;
        
        -- Verileri taşı
        UPDATE Orders SET ShippingAddressDetail = ShippingAddress;
        
        -- Eski kolonu kaldır (isteğe bağlı)
        -- ALTER TABLE Orders DROP COLUMN ShippingAddress;
        
        PRINT 'Orders tablosunda ShippingAddress alanı ShippingAddressDetail olarak güncellendi.';
    END
END
*/

-- Model kontrolü - AddressDetail alanı Address tablosunda var mı kontrol et
IF EXISTS (SELECT * FROM sys.tables WHERE name = 'Addresses') 
   AND COL_LENGTH('Addresses', 'Address') IS NOT NULL
   AND COL_LENGTH('Addresses', 'AddressDetail') IS NULL
BEGIN
    -- AddressDetail sütunu ekle 
    ALTER TABLE Addresses ADD AddressDetail nvarchar(500) NOT NULL DEFAULT '';
    
    -- Verileri taşı
    UPDATE Addresses SET AddressDetail = Address;
    
    -- Eski kolonu kaldır (opsiyonel)
    -- ALTER TABLE Addresses DROP COLUMN Address;
    
    PRINT 'Addresses tablosunda Address alanı AddressDetail olarak güncellendi.';
END
ELSE
BEGIN
    PRINT 'Addresses tablosunda güncelleme yapılmadı, kontrol edin.';
END 