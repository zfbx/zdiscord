--[[
 - This file is part of zdiscord.
 - Copyright (C) 2021 Tony/zfbx
 - source: <https://github.com/zfbx/zdiscord>
 -
 - zdiscord is free software: you can redistribute it and/or modify
 - it under the terms of the GNU General Public License as published by
 - the Free Software Foundation, either version 3 of the License, or
 - (at your option) any later version.
 -
 - zdiscord is distributed in the hope that it will be useful,
 - but WITHOUT ANY WARRANTY; without even the implied warranty of
 - MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 - GNU General Public License for more details.
 -
 - You should have received a copy of the GNU General Public License
 - along with zdiscord. If not, see <https://www.gnu.org/licenses/>.
--]]

RegisterNetEvent(GetCurrentResourceName()..':kill', function()
    SetEntityHealth(PlayerPedId(), 0)
end)

RegisterNetEvent(GetCurrentResourceName()..':teleport', function(x, y, z, withVehicle)
    x = tonumber(x)
    y = tonumber(y)
    z = tonumber(z)
    if (withVehicle) then
        SetPedCoordsKeepVehicle(PlayerPedId(), x, y, z)
    else
        SetEntityCoords(PlayerPedId(), x, y, z);
    end
end)

-- Add staff reply command? (reply to the same channel that a message was sent to the player from or default to a reports channel?)
