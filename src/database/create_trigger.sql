DELIMITER $$

CREATE TRIGGER after_adoption_insert
AFTER INSERT ON adoptions
FOR EACH ROW
BEGIN
    UPDATE pets 
    SET status = 'adopted' 
    WHERE id = NEW.pet_id;
END$$

DELIMITER ;

DELIMITER $$

CREATE TRIGGER before_adoption_insert
BEFORE INSERT ON adoptions
FOR EACH ROW
BEGIN
    DECLARE pet_status VARCHAR(50);
    DECLARE already_adopted INT;

    SELECT status INTO pet_status FROM pets WHERE id = NEW.pet_id;

    IF pet_status != 'available' THEN
        SIGNAL SQLSTATE '45000' 
        SET MESSAGE_TEXT = 'Operação cancelada: Este pet não está disponível para adoção.';
    END IF;

    SELECT COUNT(*) INTO already_adopted 
    FROM adoptions 
    WHERE user_id = NEW.user_id AND pet_id = NEW.pet_id;

    IF already_adopted > 0 THEN
        SIGNAL SQLSTATE '45000' 
        SET MESSAGE_TEXT = 'Operação cancelada: O usuário já adotou este pet anteriormente.';
    END IF;
END$$

DELIMITER ;