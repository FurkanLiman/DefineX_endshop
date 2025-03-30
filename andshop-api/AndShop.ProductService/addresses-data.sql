-- Örnek adres verileri için SQL script
-- Öncelikle kullanıcıların var olduğundan emin olun

-- Test kullanıcısı için örnek adresler
DECLARE @userId INT = (SELECT TOP 1 Id FROM Users WHERE Email = 'test@example.com');

-- Kullanıcı varsa adres ekle
IF @userId IS NOT NULL
BEGIN
    -- Önceki varsayılan adresleri sıfırla
    UPDATE Addresses SET IsDefault = 0 WHERE UserId = @userId AND IsDefault = 1;
    
    -- Adres 1: Ev adresi (varsayılan)
    IF NOT EXISTS (SELECT * FROM Addresses WHERE UserId = @userId AND Title = 'Ev Adresim')
    BEGIN
        INSERT INTO Addresses (UserId, Title, FullName, Phone, City, District, AddressDetail, ZipCode, IsDefault)
        VALUES (@userId, 'Ev Adresim', 'Test Kullanıcı', '(555) 123 45 67', 'İstanbul', 'Kadıköy', 
                'Caferağa Mah. Moda Cad. No:123 D:5', '34710', 1);
        PRINT 'Ev adresi eklendi.';
    END
    
    -- Adres 2: İş adresi
    IF NOT EXISTS (SELECT * FROM Addresses WHERE UserId = @userId AND Title = 'İş Adresim')
    BEGIN
        INSERT INTO Addresses (UserId, Title, FullName, Phone, City, District, AddressDetail, ZipCode, IsDefault)
        VALUES (@userId, 'İş Adresim', 'Test Kullanıcı', '(555) 123 45 67', 'İstanbul', 'Şişli', 
                'Mecidiyeköy Mah. Büyükdere Cad. No:201 Kat:4', '34394', 0);
        PRINT 'İş adresi eklendi.';
    END
END
ELSE
BEGIN
    PRINT 'test@example.com mail adresine sahip kullanıcı bulunamadı.';
    
    -- Alternatif olarak sistemdeki ilk kullanıcıya adres ekle
    SET @userId = (SELECT TOP 1 Id FROM Users);
    
    IF @userId IS NOT NULL
    BEGIN
        -- Önceki varsayılan adresleri sıfırla
        UPDATE Addresses SET IsDefault = 0 WHERE UserId = @userId AND IsDefault = 1;
        
        -- Adres 1: Ev adresi (varsayılan)
        IF NOT EXISTS (SELECT * FROM Addresses WHERE UserId = @userId AND Title = 'Ev Adresim')
        BEGIN
            INSERT INTO Addresses (UserId, Title, FullName, Phone, City, District, AddressDetail, ZipCode, IsDefault)
            VALUES (@userId, 'Ev Adresim', 'Kullanıcı 1', '(555) 123 45 67', 'İstanbul', 'Kadıköy', 
                    'Caferağa Mah. Moda Cad. No:123 D:5', '34710', 1);
            PRINT 'İlk kullanıcı için ev adresi eklendi.';
        END
    END
    ELSE
    BEGIN
        PRINT 'Sistemde hiç kullanıcı bulunamadı. Önce bir kullanıcı oluşturun.';
    END
END 